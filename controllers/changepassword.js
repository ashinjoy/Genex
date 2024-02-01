const userModel=require("../models/userModel")
const bcrypt=require("bcrypt")
 const load_ChangePassword=async(req,res)=>{
    try {
        res.render("user/changepassword")
    } catch (error) {
        console.error(error)
    }
}

const changePassword=async(req,res)=>{
    const {userid}=req.session
    const {current_pwd,new_pwd,confirm_newpwd}=req.body
    if(new_pwd === confirm_newpwd){
        const userdetails=await userModel.findById({_id:userid})
        if(userdetails && await bcrypt.compare(current_pwd,userdetails.password)){
            const saltRounds=13
            const hashedPassword=await bcrypt.hash(new_pwd,saltRounds)
            const passwordUpdate=await userModel.findByIdAndUpdate({_id:userid},{$set:{password:hashedPassword}})
            res.redirect("/myaccount")
        }
        else{
            res.render("user/changepassword",{error:"Current Password is incorrect"})
        }
        
    }
    else{
        console.log("enter matching password")
    }

}
module.exports={load_ChangePassword,changePassword}