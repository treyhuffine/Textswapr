var mongoose = require('mongoose');

var Trade = mongoose.model('trade', {
  tradeInitiatorUsername: {type: String, required: true},
  tradeInitiatorDisplayName: {type: String, required: true},
  tradeInitiatorID: {type: String, required: true},
  tradeReceiverUsername: {type: String, required: true},
  tradeReceiverDisplayName: {type: String, required: true},
  tradeReceiverID: {type: String, required: true},
  initiatorBookID: {type: String,required: true},
  receiverBookID: {type: String, required: true},
  initiatorBookTitle: {type: String, required: true},
  receiverBookTitle: {type: String, required: true},
  initiatorAccepted: {type: Boolean, required: true, default: true},
  receiverAccepted: {type: Boolean, required: true, default: false},
  tradeOpen: {type: Boolean, required: true, default: true},
  availableToTrade: {type: Boolean, required: true, default: true},
  createdAt: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model('trade', Trade);
