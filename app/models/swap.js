var mongoose = require('mongoose');

var Swap = mongoose.model('swap', {
  tradeInitiator: {type: String, required: true},
  tradeReceiver: {type: String, required: true},
  initiatorBook: {type: String,required: true},
  receiverBook: {type: String, required: true},
  initiatorAccepted: {type: Boolean, required: true, default: true},
  receiverAccepted: {type: Boolean, required: true, default: false},
  tradeCompleted: {type: Boolean, required: true, default: false},
  createdAt: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model('Swap', Swap);
