const { default: mongoose } = require("mongoose");
const orderModel = require("../models/order");

const load_orderslist = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products.productid")
      .populate("userid");
    console.log(orders);
    res.render("admin/orderlist", { orders });
  } catch (error) {
    console.error(error);
  }
};
const load_Ordersummary = async (req, res) => {
  try {
    const { oid, pid } = req.query;

    const orderDetail = await orderModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(oid) } },
      { $unwind: "$products" },
      { $match: { "products.productid": new mongoose.Types.ObjectId(pid) } },
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

    res.render("admin/orderdetail", { orderDetail });
    console.log(orderDetail)
  } catch (error) {
    console.error(error);
  }
};
const changestatus=async(req,res)=>{
  const{value,oid,pid}=req.query
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
  
  const updateStatus=await orderModel.findOneAndUpdate({_id:oid,'products.productid':pid},{$set:{'products.$.status':value}})
 const paymentMethod= updateStatus.paymentMethod
 if(paymentMethod==="wallet"){
  const refundIntoWallet=await userModel.findByIdAndUpdate({_id:userid},{$inc:{WalletBalance:priceReduction}})
  const  walletRefund=await wallet.findOneAndUpdate({orderId:oid},{$inc:{WalletBalance:priceReduction}})

 }
  res.status(200).json({data:"message"})
}
module.exports = { load_orderslist, load_Ordersummary,changestatus };
