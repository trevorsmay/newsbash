var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");


var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = process.env.PORT || 3000;

// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsbashdb";

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { 
    //useNewUrlParser: true });
});

require("./routes/index.js")(app);

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});