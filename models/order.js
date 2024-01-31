const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  addressid: { type: mongoose.Schema.Types.ObjectId, ref: "address" },
  products: {
    type: [
      {
        productid: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        qty: Number,
        size:String,
        status: {
          type: String,
          default: "processing",
        },
      },
    ],
  },
  totalprice: Number,
  paymentMethod: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const orderModel = mongoose.model("order", orderSchema);
module.exports = orderModel;
