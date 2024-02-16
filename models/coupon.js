const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema({
  name:{ type: String, required: true },
  description:{
    type: String,
    required: true
  },
  couponCode:{
    type: String,
    required: true
  },
  couponlimit:{
    type: Number,
    required: true
  },
  status:{
    type:Boolean,
    default:true
  },
  is_active:{
    type:Boolean,
    default:true
  },
  reductionRate:{
    type:Number,
    required:true
  }

});
const couponModel = mongoose.model("coupon", couponSchema);
module.exports = couponModel;
