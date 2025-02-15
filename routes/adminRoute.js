const express = require("express");
const adminRouter = express.Router();
const adminAuthController = require("../controllers/adminAuthController");
const userManagementController = require("../controllers/userManagementController");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const orderController = require("../controllers/adminorderManagement");
const dashboardController = require("../controllers/dashboardController");
const pagination = require("../controllers/paginationController");
const coupon = require("../controllers/couponManagement");
const offer = require("../controllers/offerMangement");

const session = require("../middleware/session");
const multer = require("../utils/multer");

adminRouter.get(
  "/",
  session.admin_islogout,
  adminAuthController.load_adminlogin
);
adminRouter.post("/", session.admin_islogout, adminAuthController.adminlogin);

adminRouter.get(
  "/logout",
  session.admin_islogin,
  adminAuthController.adminlogout
);

adminRouter.get("/weekly-report", dashboardController.weeklyReport);
adminRouter.get("/monthly-report", dashboardController.monthlyreport);

adminRouter.get(
  "/home",
  session.admin_islogin,
  userManagementController.load_admindashboard
);
adminRouter.get(
  "/users",
  session.admin_islogin,
  userManagementController.load_usermanagement
);
adminRouter.get(
  "/users/block",
  session.admin_islogin,
  userManagementController.blockuser
);
adminRouter.get(
  "/users/unblock",
  session.admin_islogin,
  userManagementController.unblockuser
);

adminRouter.get("/defaultpagination", pagination.pagination);
adminRouter.get("/pagination", pagination.pagination);
adminRouter.get("/defaultpaginationOrders", pagination.orderPagination);
adminRouter.get("/paginationofOrders", pagination.orderPagination);
// adminRouter.get('/paginationofOrders',pagination.orderPagination)
adminRouter.get("/defaultproductlist-pagination", pagination.productPagination);
adminRouter.get("/productlist-pagination", pagination.productPagination);

adminRouter.get(
  "/sales-report",
  session.admin_islogin,
  dashboardController.load_salesreport
);
adminRouter.get(
  "/default-salesreport",
  session.admin_islogin,
  dashboardController.salesData
);
adminRouter.get(
  "/filter-report",
  session.admin_islogin,
  dashboardController.salesData
);

adminRouter.get(
  "/categories",
  session.admin_islogin,
  categoryController.load_category
);
adminRouter.post(
  "/categories",
  multer.single("catimg"),
  categoryController.add_category
);
adminRouter.get(
  "/categories/block-cat",
  session.admin_islogin,
  categoryController.blockcategory
);
adminRouter.get(
  "/categories/unblock-cat",
  session.admin_islogin,
  categoryController.unblockcategory
);
adminRouter.get(
  "/categories/update-category",
  session.admin_islogin,
  categoryController.load_updatecategory
);
adminRouter.post(
  "/categories/update-category",
  multer.single("catimg"),
  categoryController.updatecategory
);
adminRouter.get(
  "/categories/delete-category",
  categoryController.deletecategory
);

adminRouter.get(
  "/products/addproduct",
  session.admin_islogin,
  productController.load_addproduct
);
adminRouter.post(
  "/products/addproduct",
  session.admin_islogin,
  multer.array("Images", 4),
  productController.add_product
);
adminRouter.get(
  "/products/productlist",
  session.admin_islogin,
  productController.load_productlist
);
adminRouter.get(
  "/products/blockproduct",
  session.admin_islogin,
  productController.product_block
);
adminRouter.get(
  "/products/unblockproduct",
  session.admin_islogin,
  productController.product_unblock
);
adminRouter.get(
  "/products/editproduct",
  session.admin_islogin,
  productController.load_editproduct
);
adminRouter.post(
  "/products/editproduct",
  session.admin_islogin,
  multer.array("Images", 4),
  productController.editproduct
);

adminRouter.get(
  "/listorders",
  session.admin_islogin,
  orderController.load_orderslist
);
adminRouter.get(
  "/ordersummary",
  session.admin_islogin,
  orderController.load_Ordersummary
);
adminRouter.get(
  "/order-changeStatus",
  session.admin_islogin,
  orderController.load_productStatusPage
);
adminRouter.get(
  "/change-orderstatus",
  session.admin_islogin,
  orderController.changestatus
);
adminRouter.get(
  "/accept-return",
  session.admin_islogin,
  orderController.accceptReturn
);
adminRouter.get(
  "/reject-return",
  session.admin_islogin,
  orderController.rejejctReturn
);

adminRouter.get("/createCoupon", session.admin_islogin, coupon.load_addCoupon);
adminRouter.post("/createCoupon", session.admin_islogin, coupon.addCoupon);
adminRouter.get("/listCoupon", session.admin_islogin, coupon.listCoupon);
adminRouter.get("/editCoupon", session.admin_islogin, coupon.loadEditCoupon);
adminRouter.post("/editCoupon", session.admin_islogin, coupon.editCoupon);
adminRouter.patch("/blockStatus", coupon.blockStatus);
adminRouter.patch("/unblockStatus", coupon.unblockStatus);
adminRouter.patch("/deleteCoupon", coupon.deleteCoupon);

adminRouter.get(
  "/bestproducts",
  session.admin_islogin,
  productController.bestProducts
);
// adminRouter.get('/bestcategory',session.admin_islogin,productController.bestCategory)

adminRouter.get("/offer", session.admin_islogin, offer.load_offerPage);
adminRouter.post("/offer", session.admin_islogin, offer.createOffer);
adminRouter.get("/delete-offer", offer.deleteOffer);

module.exports = adminRouter;
