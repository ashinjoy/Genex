const mongoose= require("mongoose")
const addressSchema= new mongoose.Schema({
 name:{
    type:String,
    required:true
 },
 phone:{
    type:String,
    required:true
 },
 pincode:{
    type:Number,
    required:true
 },
houseno:{
    type:String,
    required:true
},
area:{
    type:String,
    required:true
},
landmark:{
    type:String,
    required:true
},
city:{
    type:String,
    required:true
},
state:{
type:String,
required:true
}
})
const addressModel=mongoose.model("address",addressSchema)
module.exports=addressModel
