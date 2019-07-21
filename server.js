var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/newsbash", { useNewUrlParser: true });

//routes

app.get("/scrape", function(req, res) {
//website I am using.
    axios.get("https://www.bbc.com/").then(function(response) {

    var $ = cheerio.load(response.data);
    // add whatever tag I want to use for information to be scraped.
    $("media_class").each(function(i, element) {

        var result = {};

        result.title = $(this)
        //if I want to add more that just a main scraped section.
        .children("a")
        .attr("href");

        db.Article.create(result)
            .then(function(dbArticle) {

                console.log(dbArticle);
            })
            .catch(function(err) {

                console.log(err);
            });
    });

    res.send("Scrape Complete");
    });
});

app.get("/articles", function(req, res) {

    db.Article.find({})
        .then(function(dbArticle) {
            
            res.json(dbArticle);
        })
        .catch(function(err) {
            
            res.json(err);
        });
});

app.get("/articles/:id", function(req, res) {

    db.Article.findOne({ _id: req.params.id })

        .populate("note")
        .then(function(dbArticle) {

            res.json(dbArticle);
        })
        .catch(function(err) {

            res.json(err);
        });
});

app.post("/articles/:id", function(req, res) {

    db.Note.create(req.body) 
        .then(function(dbNote) {

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.post("/saveItem/:id", function(req,res) {
    Item.findByIdAndUpdate(req.params.id, {$set: { saved: true}})
    .exec( function(err, data) {
        if (err) throw err;
        res.end();
    });
});

app.get("/", function(req,res) {
    Item.find({ saved: false })
        .sort({ date: -1 })
        .exec( function (error, data) {
            if (error) throw error;
            res.render("index", {content: data});
        }); 
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});