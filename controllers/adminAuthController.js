const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const load_adminlogin=async(req,res)=>{
    try {
    res.render("admin/adminlogin")
        
    } catch (error) {
        console.error(error)
    }
  }
  const adminlogin=async(req,res)=>{
    try {
        const{email,pwd}=req.body;
        const admin=await userModel.findOne({email:email})
        console.log(admin)
    if(admin && (await bcrypt.compare(pwd,admin.password))){
      if(admin.is_admin === 1){
        console.log("hi")
        req.session.adminid=admin._id
        res.redirect("/admin/home")
      }
     else{
      res.render("admin/adminlogin",{not_authorized:"You are not authorized"})
     }
    }
    else{
      res.render("admin/adminlogin",{invalid:"Invalid Credentials"})
    }
      }
     catch (error) {
        console.error(error)
    }
}

const adminlogout=async(req,res)=>{
  try {
    req.session.adminid = null
    res.redirect("/admin")
  } catch (error) {
    console.log(error)
  }
 
}




module.exports={load_adminlogin,adminlogin,adminlogout}