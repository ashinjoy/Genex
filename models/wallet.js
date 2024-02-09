const mongoose = require("mongoose");
const walletSchema = new mongoose.Schema({
  redeemedAmount: { type: Number, default: 0 },
  refundedAmount: { type: Number, default: 0 },

  date: { type: Date, default: Date.now },

  orderId: { type: mongoose.Schema.Types.ObjectId, required: true },

  paymentMethod: { type: String, required: true },
  userid: { type: mongoose.Schema.Types.ObjectId, required: true },
});
const walletModel=mongoose.model('wallet',walletSchema)
module.exports=walletModel
