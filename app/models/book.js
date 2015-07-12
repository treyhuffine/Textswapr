var mongoose = require('mongoose');

var Book = mongoose.model('Book', {
  ownerId: {type: String, required: true},
  ownerDisplayName: {type: String, required: true},
  ownerUsername: {type: String, required: true},
  createdAt: {type: Date, required: true, default: Date.now},
  title: {type: String, required: true},
  ISBN: {type: String, required: true},
  condition: {type: String, required: true},
  subject: {type: String, required: true},
  author: {type: String, required: true},
  edition: {type: String, required: true},
  img: {type: String, required: true}
});

module.exports = mongoose.model('Book', Book);
