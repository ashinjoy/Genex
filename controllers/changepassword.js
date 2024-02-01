const userModel=require("../models/userModel")
const bcrypt=require("bcrypt")
const nodemailer=require("../utils/mailer")
const jwt=require("jsonwebtoken")
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

const load_forgotPassword = async(req,res)=>{
    try {
        res.render("user/forgotpassword")
    } catch (error) {
        console.error(error)
    }
}
const forgotPassword=async(req,res)=>{
    try {
        const {email}=req.body
        const is_userRegistered=await userModel.findOne({email:email})
       if(is_userRegistered){
        const newSecret=process.env.jwt_secret+is_userRegistered.password
        const payload={
            userid:is_userRegistered._id,
            email:is_userRegistered.email
        }
        const jwt_token=jwt.sign(payload,newSecret,{expiresIn:'15m'})
        const link=`http://localhost:3000/reset-password?id=${is_userRegistered._id}&token=${jwt_token}`
        nodemailer.sendLink(link,email)
        res.redirect("/login")

       }
    } catch (error) {
        console.error(error)
    }
}
const load_resetPassword=async(req,res)=>{
    try {
        const {id}=req.query
        res.render("user/resetpassword",{id})
    } catch (error) {
        console.error(error)
    }
}
const resetPassword=async(req,res)=>{
    try {

        const {new_pwd,confirm_newpwd,id}=req.body
        if(new_pwd ===confirm_newpwd ){
            const hashpwd=await bcrypt.hash(new_pwd,13)
            const pwdUpdate=await userModel.findByIdAndUpdate({_id:id},{$set:{password:hashpwd}})
            res.redirect("/login")
        }
        else{
            console.log("password Incorrect")
        }
        
    } catch (error) {
        console.error(error)
    }
}
module.exports={load_ChangePassword,changePassword,load_forgotPassword , forgotPassword,load_resetPassword,resetPassword}