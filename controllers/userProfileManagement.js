

const userModel = require("../models/userModel")

const loadUserProfile=async(req,res)=>{
    try {
        const {userid}=req.session
        const user=await userModel.findById({_id:userid})
        res.render("user/userDashboard",{user})
    } catch (error) {
        console.error(error)
    }
}


const load_edituser=async(req,res)=>{
    try {
        const {uid}=req.query
        const edituser=await userModel.findById({_id:uid})
        res.render("user/editUser",{edituser})
    } catch (error) {
        console.error(error)
    }
}
const edituser=async(req,res)=>{
    try {
        
        const {name,phone,email,uid}=req.body
        const userdetail={
            uname:name,
            phone:phone,
            email:email
        }
        console.log("uid",uid)
        const editeduser=await userModel.findByIdAndUpdate({_id:uid},{$set:userdetail})
        res.redirect("/myaccount")


    } catch (error) {
        console.error(error)
    }
}
module.exports={loadUserProfile,load_edituser,edituser}