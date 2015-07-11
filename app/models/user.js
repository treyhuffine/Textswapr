var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  twitter          : {
    id           : String,
    token        : String,
    tokenSecret  : String,
    displayName  : String,
    username     : String
  }
});

module.exports = mongoose.model('User', userSchema);
