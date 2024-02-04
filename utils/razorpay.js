const Razorpay=require("razorpay")

var instance = new Razorpay({ key_id: process.env.razorpay_keyid, key_secret: process.env.razorpay_key_secret })

function generate_razorpayOrder(orderId,total){
return new Promise((resolve,reject)=>{
    instance.orders.create({
        amount: total * 100,
        currency: "INR",
        receipt: orderId,
        notes: {
            key1: "value3",
            key2: "value2"
        }
        },function(err,order){
            if(err){
                console.log(err)
            }
            else{
                console.log("New Order:",order)
                 resolve(order)
            }
        })
})
   
}


module.exports={generate_razorpayOrder}