const mongoose = require("mongoose");
const offerSchema = new mongoose.Schema({
  offertype: {
    type: String,
    required: true,
  },

  categoryid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  productid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const offerModel = mongoose.model("offer", offerSchema);
module.exports = offerModel;
