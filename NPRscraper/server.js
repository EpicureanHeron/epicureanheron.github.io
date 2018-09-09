var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//NEED TO ADD HANDLEBARS AND REQUEST
//USE https://www.npr.org/sections/news/

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
//var axios = require("axios");
var request = require("request")
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();



// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/NPR");

// Routes

// A GET route for scraping the echoJS website


app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("https://www.npr.org/sections/news/", function(error, response, html) {

    // Load the HTML into cheerio
    var $ = cheerio.load(html);
  
    // Make an empty array for saving our scraped info
    var results = [];
  
    
  
    // With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "site"
    $(".item-info").each(function(i, element) {
      
      /* Cheerio's find method will "find" the first matching child element in a parent.
       *    We start at the current element, then "find" its first child a-tag.
       *    Then, we "find" the lone child img-tag in that a-tag.
       *    Then, .attr grabs the imgs srcset value.
       *    The srcset value is used instead of src in this case because of how they're displaying the images
       *    Visit the website and inspect the DOM if there's any confusion
      */
      // var imgLink = $(element).attr("src");
  
      // var title = $(element).attr("alt")
      // var link = $(element).attr("title")
      var title = $(element).find("h2").text()
      var link = $(element).find("h2").find("a").attr("href")
      var teaser = $(element).find(".teaser").text()
  
      // console.log(link)
      // // Push the image's URL (saved to the imgLink var) into the results array
      var newArticle = {
        titleInfo: title,
        linkInfo: link,
        teaserInfo: teaser
      }


      // Create a new Article using the `result` object built from scraping
      db.Article.create(newArticle)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({})

  .then(function(articles){
    res.json(articles)
  })
  .catch(function(err) {
    return res.json(err);
  })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findOne({"_id": req.params.id})

  .populate("note")

  .then(function(articleNotes){
    res.json(articleNotes)
  })
  .catch(function(err) {
    return res.json(err);
  })

});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  var notes = req.body
  db.Note.create(notes)

  .then(function(noteInfo){
        //initially tried the below
  //   db.Article.update(
  //     { "_id": req.params.id },
  //     { $set:
  //        {
  //          "note": noteInfo
  //        }
  //     }
  //  )

  //this is from the solution. It doesn't use $set and is using a different method (update vs findOneAndUpdate)
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: noteInfo._id }, { new: true });


  })

  .catch(function(err) {
    return res.json(err);
  })
  //res.json??

});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
