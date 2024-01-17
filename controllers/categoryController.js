
const categoryModel = require("../models/category");
const sharp=require("sharp");
const path=require("path");

const load_category = async (req, res) => {
    try {
      const category = await categoryModel.find({});
      res.render("admin/category", { category });
    } catch (err) {
      console.error(err);
    }
  };
  const add_category = async (req, res) => {
    try {
  
      const { catname, description } = req.body;
      console.log(req.file)
      const {filename}=req.file
  
  const check_category=await categoryModel.findOne({name:catname})
      console.log(catname, description);
      if(!check_category){
        const category = {
          name: catname,
          description: description,
          img:filename
        };
    
        console.log(category);
    
        const cat_details = await categoryModel.create(category);
  
        console.log(cat_details);
        res.redirect("/admin/products/productlist")
      }
      else{
        const category = await categoryModel.find({});
        res.render("admin/category",{category,duplicate:"The category is already present"})
      }
  
  
    } catch (err) {
      console.error(err);
    }
  };
  const blockcategory = async (req, res) => {
    try {
      const { id } = req.query;
      const blockedcategory = await categoryModel.findByIdAndUpdate(
        { _id: id },
        { $set: { status: false } }
      );
      console.log(blockedcategory);
      res.status(200).json({ data: "success" });
    } catch (err) {
      console.error(err);
    }
  };
  
  const unblockcategory = async (req, res) => {
    try {
      const { id } = req.query;
      const unblockedcategory = await categoryModel.findByIdAndUpdate(
        { _id: id },
        { $set: { status: true } }
      );
      console.log(unblockedcategory);
      res.status(200).json({ data: "success" });
    } catch (err) {
      console.error(err);
    }
  };
  
  const load_updatecategory = async (req, res) => {
    try {
      const { id } = req.query;
      const updatedetail = await categoryModel.findById({ _id: id });
      console.log(updatedetail);
      res.render("admin/updatecategory", { updatedetail });
    } catch (err) {
      console.log(err);
    }
  };
  const updatecategory = async (req, res) => {
    try{
      console.log("enetred updatecategory")
      const catimg=req.file.path
      // console.log(catimg)
      const outputpath = path.join(__dirname,"../assets","cropcat"+req.file.filename)
      // console.log(outputpath)
      const croppedcatimg=await sharp(catimg).resize({width: 500, height: 500 ,fit:"cover"}).toFile(outputpath)
     const catfilename=path.basename(outputpath)
     console.log(catfilename)
      const { catname, description ,catid} = req.body;
      const updatedcategory = {
        name: catname,
        description: description,
        img:catfilename
      };
      const updated_data = await categoryModel.findByIdAndUpdate({_id:catid},{$set:updatedcategory});
      console.log(updated_data);
      res.redirect("/admin/categories")
    }
    catch(err){
      console.error(err)
    }
    
    }
    const deletecategory =async(req,res)=>{
        try {
          console.log("deletecat")
          const{id} =req.query
          const deletecat=await categoryModel.findByIdAndDelete({_id:id})
          res.status(200).json({data:"success"})
        } catch (error) {
          console.log(error)
        }
      }
  
module.exports={load_category,add_category,blockcategory,unblockcategory,load_updatecategory,updatecategory,deletecategory}