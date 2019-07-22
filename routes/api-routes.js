var cheerio = require("cheerio");
//var request = require("request");
var db = require("../models");

module.exports = function(app) {

        app.get("/api/all", function(req, res) {

        db.Article.find({$query: {saved: false} }).sort( { date: -1 })
        .then( function(response) {
            res.json(response.length);
        })
    });

    app.get("/api/notes/all", function(req, res) {

        db.Note.find({})
        .then( function(response) {
            res.json(response)
        })
    });

    app.post("/api/scrape", function(req, res) {

        request("http://www.npr.org/sections/news/", function(error, response, html) {

        var $ = cheerio.load(html);

        $("article.item").each(function(i, element) {

            var article = $(element).find(".item-info").find(".title").find("a").text();
            var summary = $(element).find('.item-info').find('.teaser').find('a').text();
            var link = $(element).find('.item-info').find('.title').children().attr("href");
            var photo = $(element).find('.item-image').find('.imagewrap').find('a').find('img').attr("src");
            var date = $(element).find('.item-info').find('.teaser').find('a').find('time').attr("datetime");

            let articleObject = {
                headline: headline,
                summary: summary,
                link: link,
                photo: photo,
                date: date
            }

            db.Headline.create(articleObject, function(error) {
                if (error) console.log("Article already exists: " + articleObject.headline)
                else {
                    console.log("New article: " + articleObject.headline);
                }

                if (i == ($("article-item").length - 1)) {
                    res.json("scrape complete")
                }
            })
        });
        })
    });

    app.delete("/api/reduce", function(req, res) {

        db.Headline.find({$query: {saved: false} }).sort( { date: -1 })
        .then( function(found) {

            var countLength = found.length;
            var overflow = countLength -10;
            var overflowArray = [];

            for (var i=0; i< (overflow); i++) {
                overflowArray.push(found[25+i]._id);
            }

            db.Headline.remove({_id: {$in: overflowArray}}, function(error, result) {

                result["length"] = countLength;
                res.json(result);
            })
        });

        app.put("/api/delete/article/:id", function(req, res) {
            var articleId = req.params.id;

            db.Headline.findOneAndUpdate(
                {_id: articleId},
                {
                    $set: {saved: false}
                }
            ).then(function(result) {
                res.json(result)
            })
        });

        app.get("/api/notes/:id", function(req, res) {
            var articleId = req.params.id;

            db.Headline.findOne(
                {_id: articleId}
            )
            .populate("note")
            .then(function(result) {
                res.json(result)
            })
        });

        app.post("/api/create/notes/:id", function(req, res) {

            db.Note.create(req.body)
            .then(function(dbNote) {
                return db.Headline.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function(result) {
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            });
        });

        app.get("/api/clear", function(req, res) {

            db.Headline.remove() 
            .then(function() {
                res.json("documents removed from headline collection")
            })
        });

        app.delete("/api/delete/notes/:id", function(req, res) {
            
            db.Note.remove(
                {_id: req.params.id}
            )
            .then(function(result) {
                res.json(result)
            })
        })
    });
   // module.exports = "api-routes";
}
