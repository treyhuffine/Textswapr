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
    res.json(req.user);
  });
  router.delete('/books/:id', function(req, res, next) {
    Book.findOneAndRemove({ '_id': req.params.id}, function (err, book){
      if (err) {
        console.log(err);
        res.status(400).json({ error: "Could not find books" });
      }
      if (!book) {
        res.status(404);
      }
      res.json({ success: "book deleted" });
    })
  });
  router.patch('/trades/remove/:id', function(req, res, next) {
    Trade.findOneAndUpdate({ '_id': req.params.id }, { tradeOpen: false }, { new: true }, function(err, deniedTrade) {
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
        newReceiver = {
          ownerUsername: acceptedTrade.tradeInitiatorUsername,
          ownerDisplayName: acceptedTrade.tradeInitiatorUsername,
          ownerId: acceptedTrade.tradeInitiatorID
        };
        newSender = {
          ownerUsername: acceptedTrade.tradeReceiverUsername,
          ownerDisplayName: acceptedTrade.tradeReceiverDisplayName,
          ownerId: acceptedTrade.tradeReceiverID
        };
        Book.findOneAndUpdate({'_id': tradeSenderBook}, newSender, { new: true }, function(err, newBook1) {
          Book.findOneAndUpdate({'_id': tradeReceiverBook}, newReceiver, { new: true }, function(err, newBook2) {
            Trade.find({'initiatorBookID': tradeSenderBook}, function(err, closedTrades1) {
              closedTrades1.forEach(function(e, i) {
                e.tradeOpen = false;
                e.save();
              });
              Trade.find({'receiverBookID': tradeSenderBook}, function(err, closedTrades2) {
                closedTrades2.forEach(function(e, i) {
                  e.tradeOpen = false;
                  e.save();
                });
                Trade.find({'initiatorBookID': tradeReceiverBook}, function(err, closedTrades3) {
                  closedTrades3.forEach(function(e, i) {
                    e.tradeOpen = false;
                    e.save();
                  });
                  Trade.find({'receiverBookID': tradeReceiverBook}, function(err, closedTrades4) {
                    closedTrades4.forEach(function(e, i) {
                      e.tradeOpen = false;
                      e.save();
                    });
                    res.json(acceptedTrade);
                  })
                })
              })
            })
          });
      });
    });
  });
  router.post('/trades', function(req, res, next) {
    var trade = new Trade(req.body);
    // if (trade.tradeInitiator === trade.tradeReceiver) {
    //   res.status(404).json({error: "Can't swap yourself"});
    //   return;
    // }
    trade.save(function(err, savedTrade) {
      if (err) {
        res.status(400).json({error: "Swap failed"});
      }
      res.json(savedTrade);
    });
  });
  router.get('/trades/initiated/:username', function(req, res, next) {
    Trade.find({ tradeInitiatorUsername: req.params.username, tradeOpen: true }).exec(function(err, trades) {
      if (err) {
        res.status(400).json({error: "Could not find swap"});
      }
      res.json(trades);
    });
  });
  router.get('/trades/requested/:username', function(req, res, next) {
    Trade.find({ tradeReceiverUsername: req.params.username, tradeOpen: true }).exec(function(err, trades) {
      if (err) {
        res.status(400).json({error: "Could not find swap"});
      }
      res.json(trades);
    });
  });
  return router;
};
module.exports = routes;
