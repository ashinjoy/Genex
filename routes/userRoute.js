const express=require("express")
const userRouter=express.Router()
const userController=require("../controllers/userController")
const emailpresent=require("../middleware/emailcheck")
const session=require("../middleware/session")
const otp=require("../middleware/userotp")

userRouter.get("/",userController.logredirect)

userRouter.get("/login",session.user_islogout,userController.Loadlogin)
userRouter.post("/login",session.user_islogout,userController.login)

userRouter.get("/signup",userController.Loadsignup)
userRouter.post("/signup",emailpresent,userController.signup)

userRouter.get("/email-verification",otp,userController.Load_otppage)
userRouter.get("/generate-otp",otp,userController.sendotp)
userRouter.post("/email-verification",otp,userController.verifyotp)

// userRouter.get("/userhome",session.user_islogin,userController.load_userhome)
userRouter.get("/usershop",session.user_islogin,userController.load_usershop)
userRouter.get("/productdetail",session.user_islogin,userController.load_productdetail)




module.exports=userRouter