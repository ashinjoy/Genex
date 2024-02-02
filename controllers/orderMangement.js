const { default: mongoose } = require("mongoose")
const orderModel=require("../models/order")
const load_orderpage=async(req,res)=>{
    try {
        
        const{userid}=req.session
        console.log(userid)
        const orders=await orderModel.find({userid:userid}).populate('products.productid')
        console.log(orders)
        res.render("user/orders",{orders})
    } catch (error) {
        console.error(error)
    }
}
const cancelorder=async(req,res)=>{
    try {
        console.log("entered cannceled order")
        const {oid,pid} =req.query
        console.log(oid)
        const cancellation=await orderModel.findOneAndUpdate({_id:oid,'products.productid':pid},{$set:{'products.$.status':"canceled"}})
        const product=await orderModel.aggregate([{$match:{_id:new mongoose.Types.ObjectId (oid)}},{$unwind:"$products"},{$match:{'products.productid':new mongoose.Types.ObjectId(pid)}},{$project:{_id:0,products:1}},{$lookup:{from:"products",localField:"products.productid",foreignField:"_id",as:"productdetail"}}])
        
        console.log("product",product)
     const priceReduction=product[0].productdetail[0].salesprice*product[0].products.qty
     const totalAfterCancel=await orderModel.findOneAndUpdate({_id:oid,'products.productid':pid},{$inc:{totalprice:-priceReduction}})
        res.status(200).json({data:"success"})
    } catch (error) {
        console.error(error)
    }
  
}
const load_orderSuccessPage=async(req,res)=>{
    try {
        res.render("user/orderSuccessfull")
    } catch (error) {
        console.error(error)
    }
}
const load_OrderSummary=async(req,res)=>{
    try{
        const {id}=req.query
        const orderDetail=await orderModel.findById({_id:id}).populate('userid').populate('products.productid').populate('addressid')
    res.render("user/orderSummary",{orderDetail})
    }
    catch(error){
console.error(error)
    }
}

module.exports={load_orderpage,cancelorder,load_orderSuccessPage,load_OrderSummary}