var routes = function(passport, mongoose) {
  var express = require('express');
  var router = express.Router();
  var Twitter = require("twitter");
  var User = require('../app/models/user');
  var Book = require('../app/models/book');

  router.get('/auth/twitter', passport.authenticate('twitter'));
  router.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), function(req, res) {
    res.redirect('/');
  });
  router.get('/auth/logout', function(req, res, next) {
    req.logout();
    res.redirect("/");
  });

  router.get('/', function(req, res, next) {
    console.log(req.user)
    res.render('index', { user: req.user });
  });

  router.post('/books', function(req, res, next) {
    var book = new Book(req.body);
    book.ownerId = req.user.id;
    book.ownerDisplayName = req.user.twitter.displayName;
    book.ownerUsername = req.user.twitter.username;
    book.save(function(err, savedBook) {
      if (err) {
        res.status(400).json({ error: "Validation failed" });
      }
      res.json(savedBook);
    })
  });
  router.get('/books', function(req, res, next) {
    Book.find({}).limit(20).exec(function(err, books) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Could not find books" });
      }
      res.json(books);
    })
  });
  router.get('/books/:isbn', function(req, res, next) {
    Book.find({ ISBN: req.params.isbn }).limit(20).exec(function(err, books) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Could not find books" });
      }
      if (!books) {
        res.status(404);
      }
      res.json(books);
    })
  });
  router.get('/users/:username', function(req, res, next) {
    User.findOne({'twitter.username': new RegExp('^'+req.params.username+'$', "i")}).exec(function(err, user) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Could not find books" });
        res.redirect('/');
      }
      res.json(user);
    })
  });
  router.get('/users/:username/books', function(req, res, next) {
    Book.find({'ownerUsername': new RegExp('^'+req.params.username+'$', "i")}).exec(function(err, books) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Could not find books" });
        res.redirect('/');
      }
      res.json(books);
    })
  });

  return router;
};
module.exports = routes;
