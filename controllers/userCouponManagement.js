const couponModel=require('../models/coupon')
const userModel=require('../models/userModel')

const applyCoupon=async(req,res)=>{
    try {
        
        const {couponCode,totalamount} =req.body
        const parseTotal=parseFloat(totalamount)
        console.log('totalAmount',parseTotal,typeof(parseTotal))
        const {userid} =req.session
        const iscouponCodeValid=await couponModel.findOne({$and:[{couponCode:couponCode},{status:true},{couponlimit:{$lte:parseTotal}}]})
        if(iscouponCodeValid){
        req.session.couponid=iscouponCodeValid._id
        const iscouponUsed=await userModel.findOne({_id:userid,coupon:{$in:[iscouponCodeValid._id]}})
        console.log('userid',userid,'id',iscouponCodeValid._id)
        console.log(iscouponUsed)
        iscouponUsed ? res.status(400).json('coupon exists') : res.status(200).json(iscouponCodeValid.reductionRate)
        }
        else{
        res.status(400).json({data:'coupon not valid'})
        }
    } catch (error) {
        console.error(error)
    }
}
const removeCoupon=async(req,res)=>{
    try {
        const {userid} = req.session
        const usedCoupons = await userModel.findById({_id:userid},{coupon:1,_id:0})
        const lastCouponUsed=usedCoupons.coupon[usedCoupons.coupon.length-1]
        const addbackAmount=await couponModel.findById({_id:lastCouponUsed},{reductionRate:1,_id:0})
        const removeCoupon=await userModel.findByIdAndUpdate({_id:userid},{$pop:{coupon:-1}})
        res.status(200).json(addbackAmount.reductionRate)
    } catch (error) {
        console.error(error)
    }
}
const couponlist=async(req,res)=>{
try {
const couponsAvailable=await couponModel.find({status:true,is_active:true})
res.render('user/listCoupon',{couponsAvailable})
} catch (error) {
    console.error(error)
}
}
module.exports={applyCoupon,removeCoupon,couponlist}