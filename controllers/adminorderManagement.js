const { default: mongoose } = require("mongoose");
const orderModel = require("../models/order");
const walletModel = require("../models/wallet");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

const load_orderslist = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("products.productid")
      .populate("userid");
    console.log(orders);
    const orderCount = await orderModel.countDocuments({});
    console.log(orderCount);
    const pageLimit = 8;
    const totalPage = Math.ceil(orderCount / pageLimit);
    console.log(totalPage);
    res.render("admin/orderlist", { orders, totalPage });
  } catch (error) {
    console.error(error);
  }
};
const load_Ordersummary = async (req, res) => {
  try {
    const { oid } = req.query;
    console.log(req.query);
    const orderDetail = await orderModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(oid) } },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "addressid",
          foreignField: "_id",
          as: "address",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productid",
          foreignField: "_id",
          as: "productsList",
        },
      },
    ]);
    console.log("ordersDetail", orderDetail);

    res.render("admin/orderdetail", { orderDetail });
  } catch (error) {
    console.error(error);
  }
};
const changestatus = async (req, res) => {
  try {
    const { value, oid, pid, uid } = req.query;
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

    const updateStatus = await orderModel.findOneAndUpdate(
      { _id: oid, "products.productid": pid },
      { $set: { "products.$.status": value } },
      { new: true }
    );
    console.log("updatedStatus", updateStatus);
    const paymentMethod = updateStatus.paymentMethod;
    const statusChangedProduct = await orderModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(oid) } },
      { $unwind: "$products" },
      { $match: { "products.productid": new mongoose.Types.ObjectId(pid) } },
    ]);
    console.log(statusChangedProduct, "productstsatuschanged");
    const orderStatus = statusChangedProduct[0].products.status;
    // const orderStatus = updateStatus.products[0].status;
    const orderDetail = await orderModel.findById({ _id: oid });
    const uncanceledProducts = await orderModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(oid) } },
      { $unwind: "$products" },
      {
        $match: {
          "products.status": {
            $nin: ["canceled", "returned", "returndeclined"],
          },
        },
      },
      { $count: "nonConceledProducts" },
    ]);
    console.log("uncanceledProducts", uncanceledProducts);
    if (orderStatus === "canceled") {
      const cancelOrderDetails = await orderModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(oid) } },
        { $unwind: "$products" },
        { $match: { "products.productid": new mongoose.Types.ObjectId(pid) } },
      ]);

      const stockupdate = await productModel.findOneAndUpdate(
        { _id: pid, "size.label": cancelOrderDetails[0].products.size },
        { $inc: { "size.$.quantity": cancelOrderDetails[0].products.qty } }
      );
      if (uncanceledProducts.length == 0) {
        const totalAfterCancel = await orderModel.findOneAndUpdate(
          { _id: oid, "products.productid": pid },
          { $inc: { totalprice: -orderDetail.totalprice } }
        );
        if (paymentMethod == "wallet") {
          // const walletRefund = await wallet.findOneAndUpdate(
          //   { orderId: oid },
          //   { $inc: { refundedAmount: orderDetail.totalprice } }
          // );
          const walletRefund = await walletModel.create({
            refundedAmount: orderDetail.totalprice,
            orderId: oid,
            paymentMethod: "wallet",
            userid: uid,
          });
          const updatewalletBalance = await userModel.findByIdAndUpdate(
            { _id: uid },
            { $inc: { WalletBalance: orderDetail.totalprice } }
          );
        } else if (paymentMethod == "razorpay") {
          const wallet = {
            redeemedAmount: 0,
            refundedAmount: orderDetail.totalprice,
            orderId: oid,
            userid: uid,
            paymentMethod: "razorpay",
          };
          const walletcreate = await walletModel.create(wallet);
          const updatewalletBalance = await userModel.findByIdAndUpdate(
            { _id: uid },
            { $inc: { WalletBalance: orderDetail.totalprice } }
          );
        }
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
          const walletRefund = await walletModel.create({
            refundedAmount: priceReduction,
            orderId: oid,
            paymentMethod: "wallet",
            userid: uid,
          });
          const updatewalletBalance = await userModel.findByIdAndUpdate(
            { _id: uid },
            { $inc: { WalletBalance: priceReduction } }
          );
        } else if (paymentMethod == "razorpay") {
          const wallet = {
            redeemedAmount: 0,
            refundedAmount: priceReduction,
            orderId: oid,
            userid: uid,
            paymentMethod: "razorpay",
          };
          const walletcreate = await walletModel.create(wallet);
          const updatewalletBalance = await userModel.findByIdAndUpdate(
            { _id: uid },
            { $inc: { WalletBalance: priceReduction } }
          );
        }
      }
    }

    res.status(200).json({ data: "message" });
  } catch (error) {
    console.error(error);
  }
};
const load_productStatusPage = async (req, res) => {
  try {
    const { oid, pid } = req.query;
    const ProductDetail = await orderModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(oid) } },
      { $unwind: "$products" },
      { $match: { "products.productid": new mongoose.Types.ObjectId(pid) } },
    ]);
    console.log("productDetail", ProductDetail);
    res.render("admin/ordertracking", { ProductDetail });
  } catch (error) {
    console.error(error);
  }
};
const accceptReturn = async (req, res) => {
  try {
    const { oid, pid, uid } = req.query;
    let priceReduction;
    const returnOrder = await orderModel.findOneAndUpdate(
      { _id: oid, "products.productid": pid },
      { $set: { "products.$.status": "returned" } }
    );

    const returnOrderDetails = await orderModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(oid) } },
      { $unwind: "$products" },
      { $match: { "products.productid": new mongoose.Types.ObjectId(pid) } },
    ]);

    const stockupdate = await productModel.findOneAndUpdate(
      { _id: pid, "size.label": returnOrderDetails[0].products.size },
      { $inc: { "size.$.quantity": returnOrderDetails[0].products.qty } }
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
    if (product[0].productdetail[0].offerPrice > 0) {
      priceReduction =
        product[0].productdetail[0].offerPrice * product[0].products.qty;
    } else {
      priceReduction =
        product[0].productdetail[0].salesprice * product[0].products.qty;
    }

    const order = await orderModel.findById({ _id: oid });
    const paymentMethod = order.paymentMethod;
    const unreturnedProducts = await orderModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(oid) } },
      { $unwind: "$products" },
      {
        $match: {
          "products.status": {
            $nin: ["canceled", "returned", "returndeclined"],
          },
        },
      },
      { $count: "nonReturnedProducts" },
    ]);
    console.log("unreturnedProducts", unreturnedProducts);
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
    console.log(unreturnedProducts.length, "unreturnedlength");

    console.log(order.totalprice, "ordertotal");
    if (unreturnedProducts.length == 0) {
      const totalAfterCancel = await orderModel.findOneAndUpdate(
        { _id: oid, "products.productid": pid },
        { $inc: { totalprice: -order.totalprice } }
      );
      if (paymentMethod == "wallet") {
        // const walletRefund = await wallet.findOneAndUpdate(
        //   { orderId: oid },
        //   { $inc: { refundedAmount: order.totalprice } }
        // );

        const walletRefund = await walletModel.create({
          refundedAmount: order.totalprice,
          orderId: oid,
          paymentMethod: "wallet",
          userid: uid,
        });
      } else if (paymentMethod == "razorpay") {
        const wallet = {
          redeemedAmount: 0,
          refundedAmount: order.totalprice,
          orderId: oid,
          userid: uid,
          paymentMethod: "razorpay",
        };
        const walletcreate = await walletModel.create(wallet);
      } else {
        const wallet = {
          redeemedAmount: 0,
          refundedAmount: order.totalprice,
          orderId: oid,
          userid: uid,
          paymentMethod: "cod",
        };
        const walletcreate = await walletModel.create(wallet);
      }
      const updatewalletBalance = await userModel.findByIdAndUpdate(
        { _id: uid },
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
        const walletRefund = await walletModel.create({
          refundedAmount: priceReduction,
          orderId: oid,
          paymentMethod: "wallet",
          userid: uid,
        });
      } else if (paymentMethod == "razorpay") {
        const wallet = {
          redeemedAmount: 0,
          refundedAmount: priceReduction,
          orderId: oid,
          userid: uid,
          paymentMethod: "razorpay",
        };
        const walletcreate = await walletModel.create(wallet);
      } else {
        const wallet = {
          redeemedAmount: 0,
          refundedAmount: priceReduction,
          orderId: oid,
          userid: uid,
          paymentMethod: "razorpay",
        };
        const walletcreate = await walletModel.create(wallet);
      }

      const updatewalletBalance = await userModel.findByIdAndUpdate(
        { _id: uid },
        { $inc: { WalletBalance: priceReduction } }
      );
    }
    console.log("prceReduction", priceReduction);

    res.status(200).json({ data: "success" });
  } catch (error) {
    console.error(error);
  }
};
const rejejctReturn = async (req, res) => {
  try {
    const { oid, pid } = req.query;
    const reject = await orderModel.findOneAndUpdate(
      { _id: oid, "products.productid": pid },
      { $set: { "products.$.status": "returndeclined" } }
    );
  } catch (error) {
    console.error(error);
  }
};
module.exports = {
  load_orderslist,
  load_Ordersummary,
  changestatus,
  load_productStatusPage,
  accceptReturn,
  rejejctReturn,
};
