const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  status:{
    type: Boolean,  
    default: true,
  },
  description:{
    type:String,
    required:true
  },
  created_at:{
    type:Date,
    default:Date.now
  },
  img:{
  type:String,
  required:true
  },
  offer:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'offer'
  }

});

const categoryModel= mongoose.model("category",categorySchema)
module.exports=categoryModel