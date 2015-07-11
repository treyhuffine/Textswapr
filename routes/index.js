var routes = function(passport, mongoose) {
  var express = require('express');
  var router = express.Router();
  var Twitter = require("twitter");

  var Book = mongoose.model("Book", {
    title: {type: String, required: true, unique: true}
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



  return router;
};
module.exports = routes;
