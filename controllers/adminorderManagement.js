const { default: mongoose } = require("mongoose");
const orderModel = require("../models/order");
const walletModel=require('../models/wallet')
const userModel=require('../models/userModel')

const load_orderslist = async (req, res) => {
  try {
    const orders = await orderModel
      .find({}).sort({createdAt:-1})
      .populate("products.productid")
      .populate("userid");
    console.log(orders);
    const orderCount=await orderModel.countDocuments({})
    console.log(orderCount)
    const pageLimit=8
    const totalPage=Math.ceil(orderCount/pageLimit)
    console.log(totalPage)
    res.render("admin/orderlist", { orders ,totalPage});
  } catch (error) {
    console.error(error);
  }
};
const load_Ordersummary = async (req, res) => {
  try {
    const { oid, pid } = req.query;
console.log(req.query)
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
  const{value,oid,pid,uid}=req.query
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
 if(paymentMethod==="wallet" ){
  
  const refundIntoWallet=await userModel.findByIdAndUpdate({_id:uid},{$inc:{WalletBalance:priceReduction}})
  const  walletRefund=await walletModel.findOneAndUpdate({orderId:oid},{$inc:{refundedAmount:priceReduction}})

 }
 else if(paymentMethod === 'razorpay'){

  const wallet={
    redeemedAmount:0,
    refundedAmount:priceReduction,
    orderId:oid,
    userid:uid,
    paymentMethod:'razorpay'

  }
  const walletcreate=await walletModel.create(wallet)   
 }

  res.status(200).json({data:"message"})
}
module.exports = { load_orderslist, load_Ordersummary,changestatus };
