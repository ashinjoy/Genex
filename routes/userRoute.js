const express=require("express")
const userRouter=express.Router()
const userController=require("../controllers/userController")
const emailpresent=require("../middleware/emailcheck")
const session=require("../middleware/session")
const otp=require("../middleware/userotp")
const cart=require("../controllers/cartManagement")
const checkout=require("../controllers/checkout")

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
userRouter.get("/add-to-cart",session.user_islogin,cart.addtocart)
userRouter.get("/loadcart",session.user_islogin,cart.loadcart)
userRouter.get("/edit-qty",session.user_islogin,cart.editquantity)
userRouter.get("/delete-cartitems",session.user_islogin,cart.deleteCart)
userRouter.get("/checkout",session.user_islogin,checkout.loadCheckout)





module.exports=userRouter