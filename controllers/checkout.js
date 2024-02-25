const addressModel = require("../models/address");
const userModel = require("../models/userModel");
const orderModel = require("../models/order");
const productModel = require("../models/productModel");
const wallet = require("../models/wallet");
const razorpay = require("../utils/razorpay");

const { default: mongoose } = require("mongoose");
const loadCheckout = async (req, res) => {
  try {
    const { userid } = req.session;
    const cartdetail = await userModel
      .findById({ _id: userid }, { _id: 0, cart: 1 })
      .populate("cart.productid");
    console.log(cartdetail);
    const productsInCart = cartdetail.cart;
    console.log(productsInCart);
    const userAddress = await addressModel.find({ userid: userid });
    console.log(userAddress);
    res.render("user/checkout", { productsInCart, userAddress });
  } catch (error) {
    console.error(error);
  }
};
const postCheckout = async (req, res) => {
  try {
    const { userid } = req.session;
    const userAddresssAvailable = await addressModel.find({ userid });
    const cartProducts = await userModel.findById(userid, { cart: 1 });
    let ordersave;
    const { address, sum, check_method } = req.body;
    const orders = {
      userid,
      addressid: address,
      products: cartProducts.cart.map((item) => ({
        productid: item.productid,
        size: item.size,
        qty: item.qty,
      })),
      totalprice: sum,
      paymentMethod: check_method,
    };

    if (check_method === "razorpay") {
      const onlinepayment = {
        ...orders,
        products: orders.products.map((product) => ({
          ...product,
          status: "pending",
        })),
      };
      ordersave = await orderModel.create(onlinepayment);
    } else if (check_method === "wallet") {
      const walpayment = {
        ...orders,
        products: orders.products.map((product) => ({
          ...product,
          status: "paid",
        })),
      };
      ordersave = await orderModel.create(walpayment);
    } else {
      ordersave = await orderModel.create(orders);
    }

    const productArray = ordersave.products;

    if (ordersave.paymentMethod === "cod") {
      if (req.session.couponid) {
        console.log("enterd coupon ininin");
        await userModel.findByIdAndUpdate(
          { _id: userid },
          { $push: { coupon: req.session.couponid } }
        );
      }
      const deletefomCart = await userModel.findByIdAndUpdate(
        { _id: userid },
        { $pull: { cart: {} } }
      );
      for (let i = 0; i < productArray.length; i++) {
        await productModel.findOneAndUpdate(
          {
            _id: productArray[i].productid,
            "size.label": productArray[i].size,
          },
          { $inc: { "size.$.quantity": -productArray[i].qty } }
        );
      }
      return res.status(200).json({ codSucess: "sucess" });
    }

    if (ordersave.paymentMethod === "wallet") {
      const walletAmount = await userModel.findById(
        { _id: userid },
        { WalletBalance: 1 }
      );
      if (walletAmount.WalletBalance >= sum) {
        if (req.session.couponid) {
          await userModel.findByIdAndUpdate(
            { _id: userid },
            { $push: { coupon: req.session.couponid } }
          );
        }
        await userModel.findByIdAndUpdate(
          { _id: userid },
          { $inc: { WalletBalance: -ordersave.totalprice } }
        );
        const walletcreate = {
          redeemedAmount: ordersave.totalprice,
          orderId: ordersave._id,
          paymentMethod: ordersave.paymentMethod,
          userid: userid,
        };
        await wallet.create(walletcreate);
        const deletefomCart = await userModel.findByIdAndUpdate(
          { _id: userid },
          { $pull: { cart: {} } }
        );
        for (let i = 0; i < productArray.length; i++) {
          await productModel.findOneAndUpdate(
            {
              _id: productArray[i].productid,
              "size.label": productArray[i].size,
            },
            { $inc: { "size.$.quantity": -productArray[i].qty } }
          );
        }
        return res.status(200).json({ walletsucess: "Payment Succees" });
      } else {
        await orderModel.findByIdAndDelete({ _id: ordersave._id });
        return res
          .status(400)
          .json({ walleterror: "Insufficient amount in wallet to Purchase" });
      }
    }

    if (ordersave.paymentMethod === "razorpay") {
      console.log("RRRRRRR");
      const razorpayOrder = await razorpay.generate_razorpayOrder(
        ordersave._id,
        ordersave.totalprice
      );
      console.log(razorpayOrder);
      return res.json(razorpayOrder);
    }
  } catch (error) {
    console.log("dfddf" + error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { loadCheckout, postCheckout };
