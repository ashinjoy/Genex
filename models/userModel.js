const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  uname:{ type: String, required: true },
  email:{
    type: String,
    required: true
  },
  phone:{
    type: Number,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  is_verified:{
    type:Number,
    default:0
  },
  is_active:{
    type:Number,
    default:1
  },
  is_admin:{
    type:Number,
    default:0
  },
  cart:[
    {
    productid:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'product'
  },
  qty:{
    type:Number
  }
},
],
default:[]
});
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
