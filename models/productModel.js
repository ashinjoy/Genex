const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  size: [
    {
      label: {
        type: String,
        enum: ["small", "medium", "large"],
      },
      quantity: {
        type: Number,
        default: 0,
      },
    },
  ],
  regularprice: {
    type: Number,
    required: true,
  },
  salesprice: {
    type: Number,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  img:[{
    type:String,
    required:true
  }]
});
const productModel=mongoose.model("product",productSchema)
module.exports=productModel