const addressModel=require("../models/address")
const userModel=require("../models/userModel")
const loadCheckout=async(req,res)=>{
   try {
    const sessionid=req.session
    const cartdetail=await userModel.findById({_id:userid},{cart:1})
    res.render("/user/checkout")
   } catch (error) {
    
   }
}
module.exports={loadCheckout}