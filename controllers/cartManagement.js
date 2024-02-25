const { default: mongoose } = require("mongoose");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const addtocart = async (req, res) => {
  try {
    if(req.session.userid){
      console.log("entered addtocart");
    const { id, qty, size } = req.query;
    const qtySelected = parseInt(qty);
    console.log("productid", id);
    const { userid } = req.session;
    console.log(userid);
    const productDetail = await productModel.findById(
      { _id: id },
      { size: { $elemMatch: { label: size } } }
    );
    console.log("productDetail" + productDetail);
    const stocksAvailable = productDetail.size[0].quantity;
    const itemExist = await userModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userid) } },
      { $unwind: "$cart" },
      {
        $match: {
          "cart.productid": new mongoose.Types.ObjectId(id),
          "cart.size": size,
        },
      },
    ]);
    console.log(itemExist);

    if (
      stocksAvailable > 0 &&
      itemExist.length === 0 &&
      stocksAvailable >= qtySelected
    ) {
      const user = await userModel.findByIdAndUpdate(
        { _id: userid },
        { $push: { cart: { productid: id, size: size, qty: qtySelected } } }
      );
      //  const stockUpdate=await productModel.updateOne({_id:id,'size.label':size},{$inc:{"size.$.quantity":-qtySelected}})
      // console.log("stock"+stockUpdate)
      res.status(200).json({ data: "success" });
    } else if (itemExist.length > 0) {
      console.log("item already exist in cart");
      res.status(409).json({ error: "Item Already exist in Cart" });
    } else {
      console.log("no stocks available");
      res.status(409).json({ error: "No stocks Available" });
    }
    }
    else{
      res.status(400).json({failure:'Please login to Shop '})
    }
    
  } catch (error) {
    console.error(error);
  }
};
const loadcart = async (req, res) => {
  try {
    const { userid } = req.session;
    const cartProducts = await userModel
      .findById({ _id: userid }, { cart: 1, _id: 0 })
      .populate("cart.productid");
    let carts = cartProducts.cart;
    console.log("carts", carts);

    res.render(
      "user/cart",
      carts.length> 0 ? { carts } :{noitem:"no item"}
    );
  } catch (error) {
    console.error(error);
  }
};
const editquantity = async (req, res) => {
  try {
    const { id, qty, pid } = req.query;
    console.log("cartid", id, "Quantity:", qty, "pid :", pid);
    let parsedqty = parseInt(qty);
    console.log(id);
    const { userid } = req.session;
    const cartqty = await userModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userid) } },
      { $unwind: "$cart" },
      { $match: { "cart._id": new mongoose.Types.ObjectId(id) } },
    ]);
    const cartProductSize = cartqty[0].cart.size;

    const verifyQuantityStock = await productModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(pid) } },
      { $unwind: "$size" },
      { $match: { "size.label": cartProductSize } },
      { $project: { Quantity: "$size.quantity", _id: 0 } },
    ]);
    console.log("QuantityStock:", verifyQuantityStock);
    const productQty = verifyQuantityStock[0].Quantity;

    if (productQty >= parsedqty) {
      const editqty = await userModel.findOneAndUpdate(
        { _id: userid, "cart._id": id },
        { $set: { "cart.$.qty": parsedqty } },
        { new: true }
      );
      res.status(200).json({ data: productQty });
    } else {
      res
        .status(400)
        .json({ error: "There is no sufficient Stock", qty: productQty });
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteCart = async (req, res) => {
  try {
    console.log("Entered delete cart");
    const { userid } = req.session;
    const { id } = req.query;
    const deleteItem = await userModel.findByIdAndUpdate(
      { _id: userid },
      { $pull: { cart: { _id: id } } }
    );
    console.log("delete" + deleteItem);
    res.status(200).json({ data: "Item Deleted Successfully" });
  } catch (error) {
    console.error(error);
  }
};
module.exports = { addtocart, loadcart, deleteCart, editquantity };
