const { default: mongoose } = require("mongoose");
const orderModel = require("../models/order");
const userModel = require("../models/userModel");
const wallet = require("../models/wallet");
const productModel = require("../models/productModel");
const crypto = require("crypto");
const invoiceGenerator = require("../utils/invoice");
const walletModel = require("../models/wallet");

const load_orderpage = async (req, res) => {
  try {
    const { userid } = req.session;
    console.log(userid);
    const orders = await orderModel
      .find({ userid: userid })
      .sort({ createdAt: -1 })
      .populate("products.productid");
    console.log(orders);
    res.render("user/orders", { orders });
  } catch (error) {
    console.error(error);
  }
};
const cancelorder = async (req, res) => {
  try {
    const { userid } = req.session;
    console.log("entered cannceled order");
    const { oid, pid } = req.query;
    let priceReduction;
    console.log(oid);
    const cancellationDetails = await orderModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(oid) } },
      { $unwind: "$products" },
      { $match: { "products.productid": new mongoose.Types.ObjectId(pid) } },
    ]);
    console.log(cancellationDetails);
    const cancellation = await orderModel.findOneAndUpdate(
      { _id: oid, "products.productid": pid },
      { $set: { "products.$.status": "canceled" } }
    );
    const stockupdate = await productModel.findOneAndUpdate(
      { _id: pid, "size.label": cancellationDetails[0].products.size },
      { $inc: { "size.$.quantity": cancellationDetails[0].products.qty } }
    );
    console.log(stockupdate);
    console.log("cancellation", cancellation);
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
    if (product[0].productdetail[0].offerPrice > 0) {
      priceReduction =
        product[0].productdetail[0].offerPrice * product[0].products.qty;
      console.log("pricereduction", priceReduction);
    } else {
      priceReduction =
        product[0].productdetail[0].salesprice * product[0].products.qty;
      console.log("pricereduction", priceReduction);
    }
    console.log("pricereduction", priceReduction);

    const order = await orderModel.findById({ _id: oid });
    const paymentMethod = order.paymentMethod;
    const uncanceledProducts = await orderModel.aggregate([         
      { $match: { _id: new mongoose.Types.ObjectId(oid) } }, 
      { $unwind: "$products" },
      { $match: { "products.status": {$nin:['canceled','returned','returndeclined']}} },
      { $count: "nonConceledProducts" },
    ]);
    console.log("uncanceledProducts", uncanceledProducts);
    const codStatus = await orderModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(oid) } },
      { $unwind: "$products" },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(pid),
          "products.status": "delivered",
        },
      },
    ]);
    console.log(codStatus);
    console.log(uncanceledProducts.length, "lengthof uncancledpro");
    if (uncanceledProducts.length == 0) {
      const totalAfterCancel = await orderModel.findOneAndUpdate(
        { _id: oid, "products.productid": pid },
        { $inc: { totalprice: -order.totalprice } }
      );
      if (paymentMethod == "wallet") {
        // const walletRefund = await wallet.findOneAndUpdate(
        //   { orderId: oid },
        //   { $inc: { refundedAmount: -order.totalprice } }
        // );
        const walletRefund = await wallet.create({
          refundedAmount: order.totalprice,
          orderId: oid,
          paymentMethod: "wallet",
          userid: userid,
        });
      } else if (paymentMethod == "razorpay") {
        const wallet = {
          redeemedAmount: 0,
          refundedAmount: order.totalprice,
          orderId: oid,
          userid: req.session.userid,
          paymentMethod: "razorpay",
        };
        const walletcreate = await walletModel.create(wallet);
      }
      const updatewalletBalance = await userModel.findByIdAndUpdate(
        { _id: userid },
        { $inc: { WalletBalance: order.totalprice } }
      );
    } else {
      const totalAfterCancel = await orderModel.findOneAndUpdate(
        { _id: oid, "products.productid": pid },
        { $inc: { totalprice: -priceReduction } }
      );
      if (paymentMethod == "wallet") {
        // const walletRefund = await wallet.findOneAndUpdate(
        //   { orderId: oid },
        //   { $inc: { refundedAmount: priceReduction } }
        // );
        // const updatewalletBalance = await userModel.findByIdAndUpdate(
        //   { _id: userid },
        //   { $inc: { WalletBalance: priceReduction } }
        // );
        const walletRefund = await wallet.create({
          refundedAmount: priceReduction,
          orderId: oid,
          paymentMethod: "wallet",
          userid: userid,
        });
      } else if (paymentMethod == "razorpay") {
        const wallet = {
          redeemedAmount: 0,
          refundedAmount: priceReduction,
          orderId: oid,
          userid: req.session.userid,
          paymentMethod: "razorpay",
        };
        const walletcreate = await walletModel.create(wallet);
      }
      const updatewalletBalance = await userModel.findByIdAndUpdate(
        { _id: userid },
        { $inc: { WalletBalance: priceReduction } }
      );
    }
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
    console.log(orderDetail);
    res.render("user/orderSummary", { orderDetail });
  } catch (error) {
    console.error(error);
  }
};
const verifyPayment = async (req, res) => {
  try {
    console.log("verifypayment", req.body);
    const { userid } = req.session;

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
        { $set: { "products.$[].status": "paymentSuccess" } }
      );
      if (req.session.couponid) {
        const isCouponUsed = await userModel.findByIdAndUpdate(
          { _id: userid },
          { $push: { coupon: req.session.couponid } }
        );
      }
      console.log(changeStatus, "orderupdate");
      const ordersave = await orderModel.findById({
        _id: req.body.order.receipt,
      });
      const productArray = ordersave.products;

      if (ordersave) {
        const deletefomCart = await userModel.findByIdAndUpdate(
          { _id: userid },
          { $pull: { cart: {} } }
        );
        console.log(deletefomCart, "delete");
        console.log("entered loop");
        for (i = 0; i < productArray.length; i++) {
          console.log(
            "pid",
            productArray[i].productid,
            "size",
            productArray[i].size,
            "qty",
            productArray[i].qty
          );
          const stockUpdate = await productModel.findOneAndUpdate(
            {
              _id: productArray[i].productid,
              "size.label": productArray[i].size,
            },
            { $inc: { "size.$.quantity": -productArray[i].qty } }
          );
        }
      }
      res.status(200).json({ verified: "success" });
    } else {
      console.log("not matched");
      console.log(req.body);
      const deleteOrder = await orderModel.findByIdAndUpdate(
        { _id: req.body.order.receipt },
        { $set: { "products.$[].status": "pending" } }
      );
      res.status(400).json({ error: "razorpay order is not verified" });
    }
  } catch (error) {
    console.log(error);
  }
};

const invoice = async (req, res) => {
  const { userid } = req.session;
  const { orderid } = req.query;
  const userDetail = await userModel.findById({ _id: userid });
  const orderDetail = await orderModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(orderid) } },
    {
      $lookup: {
        from: "addresses",
        localField: "addressid",
        foreignField: "_id",
        as: "addressDetail",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "products.productid",
        foreignField: "_id",
        as: "productDetails",
      },
    },
  ]);
  console.log("userDetail", userDetail);
  console.log("orderDetail", orderDetail);

  const invoiceCreate = await invoiceGenerator.generateInvoice(orderDetail);
  console.log("returned invoice");
  console.log(invoiceCreate);
  res.status(200).json(invoiceCreate);
};

const returnRequest = async (req, res) => {
  try {
    const { userid } = req.session;
    const { oid, pid } = req.query;

    const returnreq = await orderModel.findOneAndUpdate(
      { _id: oid, "products.productid": pid },
      { $set: { "products.$.status": "returnRequested" } }
    );
    res.status(200).json({ request: "sucess" });
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  load_orderpage,
  cancelorder,
  load_orderSuccessPage,
  load_OrderSummary,
  verifyPayment,
  invoice,
  returnRequest,
};
