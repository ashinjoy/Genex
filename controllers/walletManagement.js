const razorpay=require("../utils/razorpay")
const crypto=require("crypto")
const userModel=require("../models/userModel")
const orderModel=require("../models/order")
const walletModel = require("../models/wallet")
const load_wallet=async(req,res)=>{
    try {
        const walletOrders=await walletModel.find({})
        const {userid}=req.session
        const WalletBalance=await userModel.findById({_id:userid},{WalletBalance:1,_id:0})
        console.log(WalletBalance)
        res.render("user/wallet",{walletOrders,WalletBalance})
    } catch (error) {
        console.error(error)
    }
}
const addMoney_wallet=async(req,res)=>{
    try {
        const {balance}=req.body
        const {userid}=req.session
        const walletOrder=await razorpay.generateOrder_Wallet(userid,balance)
        console.log(walletOrder)
        res.json(walletOrder)

        
    } catch (error) {
        console.error(error)
    }
}

const verifypayment=async(req,res)=>{
    try {
        console.log(req.body)
        let hmac = crypto.createHmac("sha256", "znGNu0tWX0antemW1siBc589");
        hmac.update(
          req.body.order.id + "|" + req.body.payment.razorpay_payment_id,
          process.env.razorpay_key_secret
        );
        hmac = hmac.digest("hex");
    
        if (hmac == req.body.payment.razorpay_signature) {
          console.log("matched");
          console.log("userid",req.body.order.receipt);
         const {amount} = req.body.order
         const amountRupee=amount/100
          const changeStatus = await userModel.findByIdAndUpdate(
            { _id: req.body.order.receipt },{$set:{WalletBalance:amountRupee}}
           
          );
          console.log(changeStatus, "orderupdate");
        } else {
       res.status(400).json({error:"Payment Failed"})

    }
 } catch (error) {
        console.error(error)
    }
}

module.exports={load_wallet,addMoney_wallet,verifypayment}