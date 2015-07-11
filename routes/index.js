var routes = function(passport, mongoose) {
  var express = require('express');
  var router = express.Router();
  var Twitter = require("twitter");

  var Book = mongoose.model("Book", {
    owner: {type: String, required: true},
    title: {type: String, required: true},
    ISBN: {type: String, required: true},
    condition: {type: String, required: true},
    subject: {type: String, required: true},
    author: {type: String, required: true},
    edition: {type: String, required: true},
    img: {type: String, required: true}
  });

  router.get('/auth/twitter', passport.authenticate('twitter'));

  // handle the callback after twitter has authenticated the user
  router.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), function(req, res) {
     // Successful authentication, redirect home.
     res.redirect('/');
  });

  router.get('/', function(req, res, next) {
    console.log(req.user)
    res.render('index', { user: req.user });
  });

  router.get('/auth/logout', function(req, res, next) {
    req.logout();
    res.redirect("/");
  });
  router.post('/books', function(req, res, next) {
    var book = new Book(req.body);
    book.owner = req.user.id;
    book.save(function(err, savedBook) {
      if (err) {
        res.status(400).json({ error: "Validation failed" });
      }
      res.json(savedBook);
    })
  });


  return router;
};
module.exports = routes;
