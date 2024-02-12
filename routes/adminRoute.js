const express=require("express");
const adminRouter=express.Router()
const adminAuthController=require("../controllers/adminAuthController")
const userManagementController=require("../controllers/userManagementController")
const categoryController=require("../controllers/categoryController")
const productController=require("../controllers/productController")
const orderController=require("../controllers/adminorderManagement")
const dashboardController =require("../controllers/dashboardController")
const pagination=require("../controllers/paginationController")


const session=require("../middleware/session")
const multer=require("../utils/multer")


adminRouter.get("/",session.admin_islogout,adminAuthController.load_adminlogin)
adminRouter.post("/",session.admin_islogout,adminAuthController.adminlogin)

adminRouter.get("/logout",session.admin_islogin,adminAuthController.adminlogout)

adminRouter.get("/weekly-report",dashboardController.weeklyReport)
adminRouter.get("/monthly-report",dashboardController.monthlyreport)

adminRouter.get("/home",session.admin_islogin,userManagementController.load_admindashboard)
adminRouter.get("/users",session.admin_islogin,userManagementController.load_usermanagement)
adminRouter.get("/users/block",session.admin_islogin,userManagementController.blockuser)
adminRouter.get("/users/unblock",session.admin_islogin,userManagementController.unblockuser)

adminRouter.get("/defaultpagination",pagination.pagination)
adminRouter.get("/pagination",pagination.pagination)






adminRouter.get("/categories",session.admin_islogin,categoryController.load_category)
adminRouter.post("/categories",multer.single('catimg'),categoryController.add_category)
adminRouter.get("/categories/block-cat",session.admin_islogin,categoryController.blockcategory)
adminRouter.get("/categories/unblock-cat",session.admin_islogin,categoryController.unblockcategory)
adminRouter.get("/categories/update-category",session.admin_islogin,categoryController.load_updatecategory)
adminRouter.post("/categories/update-category",multer.single('catimg'),categoryController.updatecategory)
adminRouter.get("/categories/delete-category",categoryController.deletecategory)

adminRouter.get("/products/addproduct",session.admin_islogin,productController.load_addproduct)
adminRouter.post("/products/addproduct",session.admin_islogin,multer.array('Images',4),productController.add_product)
adminRouter.get("/products/productlist",session.admin_islogin,productController.load_productlist)
adminRouter.get("/products/blockproduct",session.admin_islogin,productController.product_block)
adminRouter.get("/products/unblockproduct",session.admin_islogin,productController.product_unblock)
adminRouter.get("/products/editproduct",session.admin_islogin,productController.load_editproduct)
adminRouter.post("/products/editproduct",session.admin_islogin,multer.array('Images',4,),productController.editproduct)



adminRouter.get("/listorders",session.admin_islogin,orderController.load_orderslist)
adminRouter.get("/ordersummary",session.admin_islogin,orderController.load_Ordersummary)
adminRouter.get("/change-orderstatus",session.admin_islogin,orderController.changestatus)


module.exports=adminRouter