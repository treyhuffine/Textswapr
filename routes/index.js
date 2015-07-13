var routes = function(passport, mongoose) {
  var express = require('express');
  var router = express.Router();
  var Twitter = require("twitter");
  var User = require('../app/models/user');
  var Book = require('../app/models/book');
  var Trade = require('../app/models/trade');

  router.get('/auth/twitter', passport.authenticate('twitter'));
  router.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }), function(req, res) {
    res.redirect('/');
  });
  router.get('/auth/logout', function(req, res, next) {
    req.logout();
    res.redirect("/");
  });
  router.get('/', function(req, res, next) {
    res.render('index', { thisUserData: req.user });
  });

  router.post('/books', function(req, res, next) {
    if (req.user) {
      var book = new Book(req.body);
      book.ownerId = req.user.id;
      book.ownerDisplayName = req.user.twitter.displayName;
      book.ownerUsername = req.user.twitter.username;
      book.save(function(err, savedBook) {
        if (err) {
          res.status(400).json({ error: "Validation failed" });
        }
        res.json(savedBook);
      });
    }
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
  router.get('/books/:bookId', function(req, res, next) {
    Book.findOne({ '_id': req.params.bookId }).exec(function(err, book) {
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Could not find books" });
      }
      if (!book) {
        res.status(404);
      }
      console.log(book);
      res.json(book);
    })
  });
  // router.get('/books/search/:isbn', function(req, res, next) {
  //   Book.find({ ISBN: req.params.isbn }).limit(20).exec(function(err, books) {
  //     if (err) {
  //       console.log(err);
  //       res.status(400).json({ error: "Could not find books" });
  //     }
  //     if (!books) {
  //       res.status(404);
  //     }
  //     res.json(books);
  //   })
  // });
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
  router.get('/currentUserData', function(req, res) {
    console.log(req.user);
    res.json(req.user);
  });
  router.delete('/books/:id', function(req, res, next) {
    console.log(req.params.id);
    Book.findOneAndRemove({ '_id': req.params.id}, function (err, book){
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Could not find books" });
      }
      if (!book) {
        res.status(404);
      }
      console.log("Deleted: " + book);
      res.json({ success: "book deleted" });
    })
  });
  router.patch('/trades/remove/:id', function(req, res, next) {
    Trade.findOneAndUpdate({ '_id': req.params.id }, { tradeOpen: false }, { new: true }, function(err, deniedTrade) {
      console.log(err, deniedTrade);
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Could not read trade data" });
      }
      if (!deniedTrade) {
        res.status(404);
      }
      res.json(deniedTrade);
    })
  });
  router.patch('/trades/accept/:id', function(req, res, next) {
    // req.body.user must match current user and receiver user and swap is open
    Trade.findOneAndUpdate({ '_id': req.params.id }, { tradeOpen: false }, { new: true }, function(err, acceptedTrade) {
      if (err) {
        res.status(400).json({error: "Could not complete transaction"});
      }
      if (!acceptedTrade) {
        res.status(404);
      }
      var tradeSenderBook = acceptedTrade.initiatorBookID;
      var tradeReceiverBook = acceptedTrade.receiverBookID;
      var newSender = {}, newReceiver = {};
      Book.find({ '_id': { $in: [tradeReceiverBook, tradeSenderBook] } }, function(err, openTrades) {
      // Book.find({ '_id': tradeReceiverBook, '_id': tradeSenderBook,  }, function(err, openTrades) {
        newReceiver = {
          ownerUsername: openTrades[0].ownerUsername,
          ownerDisplayName: openTrades[0].ownerDisplayName,
          ownerId: openTrades[0].ownerId
        };
        newSender = {
          ownerUsername: openTrades[1].ownerUsername,
          ownerDisplayName: openTrades[1].ownerDisplayName,
          ownerId: openTrades[1].ownerId
        };
        Book.findOneAndUpdate({'_id': tradeSenderBook}, newReceiver, { new: true }, function(err, newBook) {
          Book.findOneAndUpdate({'_id': tradeReceiverBook}, newSender, { new: true }, function(err, newBook) {
            res.json(acceptedTrade);
          });
        });
      })
      // console.log("sender", newSender);
      // console.log("receiver", newReceiver);
      // Book.findOne({'_id': tradeSenderBook}, function(err, readBook) {
      //   newReceiver = {
      //     ownerUsername: readBook.ownerUsername,
      //     ownerDisplayName: readBook.ownerDisplayName,
      //     ownerId: readBook.ownerId
      //   };
      // });
      // Book.findOne({'_id': tradeReceiverBook}, function(err, readBook) {
      //   newSender = {
      //     ownerUsername: readBook.ownerUsername,
      //     ownerDisplayName: readBook.ownerDisplayName,
      //     ownerId: readBook.ownerId
      //   };
      // });
      // Trade books -> change owner of each book
      // set all swapOpen with the books for each user to false
    });
  });
  router.post('/trades', function(req, res, next) {
    var trade = new Trade(req.body);
    console.log(trade);
    if (trade.tradeInitiator === trade.tradeReceiver) {
      res.status(404).json({error: "Can't swap yourself"});
      return;
    }
    trade.save(function(err, savedTrade) {
      console.log(savedTrade);
      if (err) {
        res.status(400).json({error: "Swap failed"});
      }
      res.json(savedTrade);
    });
  });
  router.get('/trades/initiated/:username', function(req, res, next) {
    console.log(req.params);
    Trade.find({ tradeInitiator: req.params.username, tradeOpen: true }).exec(function(err, trades) {
      if (err) {
        res.status(400).json({error: "Could not find swap"});
      }
      res.json(trades);
    });
  });
  router.get('/trades/requested/:username', function(req, res, next) {
    Trade.find({ tradeReceiver: req.params.username, tradeOpen: true }).exec(function(err, trades) {
      if (err) {
        res.status(400).json({error: "Could not find swap"});
      }
      res.json(trades);
    });
  });
  return router;
};
module.exports = routes;
