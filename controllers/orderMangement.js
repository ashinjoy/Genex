const { default: mongoose } = require("mongoose");
const orderModel = require("../models/order");
const crypto = require("crypto");
const load_orderpage = async (req, res) => {
  try {
    const { userid } = req.session;
    console.log(userid);
    const orders = await orderModel
      .find({ userid: userid })
      .populate("products.productid");
    console.log(orders);
    res.render("user/orders", { orders });
  } catch (error) {
    console.error(error);
  }
};
const cancelorder = async (req, res) => {
  try {
    console.log("entered cannceled order");
    const { oid, pid } = req.query;
    console.log(oid);
    const cancellation = await orderModel.findOneAndUpdate(
      { _id: oid, "products.productid": pid },
      { $set: { "products.$.status": "canceled" } }
    );
    const product = await orderModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(oid) } },
      { $unwind: "$products" },
      { $match: { "products.productid": new mongoose.Types.ObjectId(pid) } },
      { $project: { _id: 0, products: 1 } },
      {
        $lookup: {
          from: "products",
          localField: "products.productid",
          foreignField: "_id",
          as: "productdetail",
        },
      },
    ]);

    console.log("product", product);
    const priceReduction =
      product[0].productdetail[0].salesprice * product[0].products.qty;
    const totalAfterCancel = await orderModel.findOneAndUpdate(
      { _id: oid, "products.productid": pid },
      { $inc: { totalprice: -priceReduction } }
    );
    res.status(200).json({ data: "success" });
  } catch (error) {
    console.error(error);
  }
};
const load_orderSuccessPage = async (req, res) => {
  try {
    res.render("user/orderSuccessfull");
  } catch (error) {
    console.error(error);
  }
};
const load_OrderSummary = async (req, res) => {
  try {
    const { id } = req.query;
    const orderDetail = await orderModel
      .findById({ _id: id })
      .populate("userid")
      .populate("products.productid")
      .populate("addressid");
    res.render("user/orderSummary", { orderDetail });
  } catch (error) {
    console.error(error);
  }
};
const verifyPayment = async (req, res) => {
  try {
    console.log("verifypayment", req.body);

    let hmac = crypto.createHmac("sha256", "znGNu0tWX0antemW1siBc589");
    hmac.update(
      req.body.order.id + "|" + req.body.payment.razorpay_payment_id,
      process.env.razorpay_key_secret
    );
    hmac = hmac.digest("hex");

    if (hmac == req.body.payment.razorpay_signature) {
      console.log("matched");
      console.log(req.body.order.receipt);
      const changeStatus = await orderModel.findByIdAndUpdate(
        { _id: req.body.order.receipt },
        { $set: { "products.$[].status": "successfull" } }
      );
      console.log(changeStatus, "orderupdate");
    } else {
      console.log("not matched");
      console.log(req.body)
      const deleteOrder = await orderModel.findByIdAndUpdate(
        { _id: req.body.order.receipt },
        { $set: { "products.$[].status": "pending" } }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  load_orderpage,
  cancelorder,
  load_orderSuccessPage,
  load_OrderSummary,
  verifyPayment,
};
