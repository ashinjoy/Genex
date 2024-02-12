const express=require("express")
const userRouter=express.Router()
const userController=require("../controllers/userController")
const emailpresent=require("../middleware/emailcheck")
const session=require("../middleware/session")
const otp=require("../middleware/userotp")
const cart=require("../controllers/cartManagement")
const checkout=require("../controllers/checkout")
const address=require("../controllers/addressManagement")
const userProfile=require("../controllers/userProfileManagement")
const orders=require("../controllers/orderMangement")
const changepassword=require("../controllers/changepassword")
const wallet=require("../controllers/walletManagement")




userRouter.get("/",userController.logredirect)
userRouter.get("/userhome",userController.load_userhome)

userRouter.get("/login",session.user_islogout,userController.Loadlogin)
userRouter.post("/login",session.user_islogout,userController.login)

userRouter.get("/signup",userController.Loadsignup)
userRouter.post("/signup",emailpresent,userController.signup)

userRouter.get('/logout',session.user_islogin,userController.logout)

userRouter.get("/email-verification",otp,userController.Load_otppage)
userRouter.get("/generate-otp",otp,userController.sendotp)
userRouter.post("/email-verification",otp,userController.verifyotp)

userRouter.get("/usershop",userController.load_usershop)
userRouter.get("/productdetail",userController.load_productdetail)

userRouter.get("/add-to-cart",cart.addtocart)
userRouter.get("/loadcart",session.user_islogin,cart.loadcart)
userRouter.get("/edit-qty",session.user_islogin,cart.editquantity)
userRouter.get("/delete-cartitems",session.user_islogin,cart.deleteCart)

userRouter.get("/checkout",session.user_islogin,checkout.loadCheckout)
userRouter.post("/checkout",session.user_islogin,checkout.postCheckout)

userRouter.get("/add-address",session.user_islogin,address.load_addAddress)
userRouter.post("/add-address",session.user_islogin,address.addAddress)
userRouter.get("/edit-address",session.user_islogin,address.load_editAddress)
userRouter.post("/edit-address",session.user_islogin,address.editAddress)
userRouter.get("/listaddress",session.user_islogin,address.listAddress)
userRouter.get("/remove-address/",session.user_islogin,address.deleteAddress)





userRouter.get("/myaccount",session.user_islogin,userProfile.loadUserProfile)

userRouter.get("/edituser",session.user_islogin,userProfile.load_edituser)
userRouter.post("/edituser",session.user_islogin,userProfile.edituser)

userRouter.get("/orders",session.user_islogin,orders.load_orderpage)
userRouter.post("/verifyPayment",session.user_islogin,orders.verifyPayment)
userRouter.get("/cancelorders",session.user_islogin,orders.cancelorder)
userRouter.get("/ordersummary",session.user_islogin,orders.load_OrderSummary)
userRouter.get("/ordersuccess",session.user_islogin,orders.load_orderSuccessPage)

userRouter.get("/change-password",session.user_islogin,changepassword.load_ChangePassword)
userRouter.post("/change-password",session.user_islogin,changepassword.changePassword)

userRouter.get("/forgot-password",changepassword.load_forgotPassword)
userRouter.post("/forgot-password",changepassword.forgotPassword)

userRouter.get("/reset-password",changepassword.load_resetPassword)
userRouter.post("/reset-password",changepassword.resetPassword)

userRouter.get("/wallet",session.user_islogin,wallet.load_wallet)
userRouter.post("/addMoney-wallet",wallet.addMoney_wallet)
userRouter.post("/verify-walletPayment",wallet.verifypayment)


module.exports=userRouter