const addressModel=require("../models/address")
const userModel=require("../models/userModel")
const orderModel=require("../models/order")
const productModel=require("../models/productModel")
const razorpay=require("../utils/razorpay")

const { default: mongoose } = require("mongoose")
const loadCheckout=async(req,res)=>{
   try {
    const {userid}=req.session
     const cartdetail=await userModel.findById({_id:userid},{_id:0,cart:1}).populate('cart.productid')
     console.log(cartdetail)
     const productsInCart=cartdetail.cart
     console.log(productsInCart)
     const userAddress=await addressModel.find({userid:userid})
     console.log(userAddress)
    res.render("user/checkout",{productsInCart,userAddress})
   } catch (error) {
    console.error(error)
   }
}
const postCheckout=async(req,res)=>{
try {
   let ordersave
   console.log("entered post ")
   const {userid}=req.session
const userAddresssAvailable=await addressModel.find({userid:userid})
const cartProducts=await userModel.findById({_id:userid},{cart:1,_id:0})
console.log(cartProducts)
if(userAddresssAvailable.length == 0){
   const {name,houseno,landmark,city,state,phone,email,country,pincode,sum,check_method}=req.body
   const  {userid}= req.session
   const Address={
      name:name,
      phone:phone,
      email:email,
      pincode:pincode,
      houseno:houseno,
      landmark:landmark,
      city:city,
      state:state,
      country:country,
      userid:userid
   }
   const userAddress=await addressModel.create(Address)

   console.log("useradd"+userAddress)
   const orders={
      userid:userid,
      addressid:userAddress._id,
      products:cartProducts.cart.map((item)=>({
         productid:item.productid,
         size:item.size,
         qty:item.qty
         
      })),
      totalprice:sum,
      paymentMethod:check_method
      
   }
    ordersave=await orderModel.create(orders)
   console.log("order",ordersave)
   // console.log("before")
   // const productsArray= ordersave.products
   // console.log("after")

   console.log("products",productsArray)
   if(ordersave){
      const deletefomCart=await userModel.findById({_id:userid},{$pull:{cart:{}}})
      console.log(deletefomCart)
      for(i=0;i<productArray.length;i++){
         console.log("pid",productArray[i].productid,"size",productArray[i].size ,"qty",productArray[i].qty)
         const stockUpdate=await productModel.findOneAndUpdate({_id:productArray[i].productid,'size.label':productArray[i].size},{$inc:{'size.$.quantity':-productArray[i].qty}})
         
       }
           
   }
   console.log("order"+ordersave)

 
}
else{
   console.log("entered order")
   const {address,sum,check_method}=req.body
   const orders={
      userid:userid,
      addressid:address,
      products:cartProducts.cart.map((item)=>({
         productid:item.productid,
         size:item.size,
         qty:item.qty
         
      })),
      totalprice:sum,
      paymentMethod:check_method
      
   }
    ordersave=await orderModel.create(orders)
   console.log("order"+ordersave)
   const productArray=ordersave.products
   if(ordersave){
      const deletefomCart=await userModel.findByIdAndUpdate({_id:userid},{$pull:{cart:{}}})
      console.log(deletefomCart,"delete")
      console.log('entered loop')
    for(i=0;i<productArray.length;i++){
      console.log("pid",productArray[i].productid,"size",productArray[i].size ,"qty",productArray[i].qty)
      const stockUpdate=await productModel.findOneAndUpdate({_id:productArray[i].productid,'size.label':productArray[i].size},{$inc:{'size.$.quantity':-productArray[i].qty}})
      
    }
   }
     
}
console.log(ordersave.paymentMethod)

if(ordersave.paymentMethod === "cod"){

   res.status(200).json({codSucess:"sucess"})
 
}
else{
console.log("entered razorpay")
 const razorpayOrder=await razorpay.generate_razorpayOrder(ordersave._id,ordersave.totalprice)
 console.log("razorpayOrder",razorpayOrder)
   res.json(razorpayOrder)
   
}




} catch (error) {
   console.log(error)
}
}

module.exports={loadCheckout,postCheckout}