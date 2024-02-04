const userModel = require("../models/userModel");
const productModel=require("../models/productModel")
const orderModel=require("../models/order");
const categoryModel = require("../models/category");
const utils=require("../utils/filter")

const load_admindashboard = async (req, res) => {
    try{
      const productsCount=await productModel.countDocuments({is_active:true})
      const ordersCount=await orderModel.countDocuments({})
      const categoryCount=await categoryModel.countDocuments({status:true})
      utils.weeklyData()
      console.log(productsCount,ordersCount)
        res.render("admin/admindashboard",{productsCount,ordersCount,categoryCount});
    }
    catch(error){
console.error(error)
    }
  };
const load_usermanagement = async (req, res) => {
    try {
      const users = await userModel.find({ is_verified: 1, is_admin: 0 });
      console.log(users);
      res.render("admin/usermanagement", { users });
    } catch (err) {
      console.error(err);
    }
  };
  
  const blockuser = async (req, res) => {
    try {
      const { id } = req.query;
  
      await userModel.findByIdAndUpdate({ _id: id }, { $set: { is_active: 0 } });
      res.status(200).json({ data: "success" });
    } catch (err) {
      console.error(err);
    }
  };
  const unblockuser = async (req, res) => {
    try {
      console.log("entered unblockuser");
      const { id } = req.query;
      await userModel.findByIdAndUpdate({ _id: id }, { $set: { is_active: 1 } });
      res.status(200).json({ data: "success" });
    } catch (err) {
      console.error(err);
    }
  };

  module.exports={load_admindashboard,load_usermanagement,blockuser,unblockuser}