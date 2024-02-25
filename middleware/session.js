const userModel = require("../models/userModel");

const user_islogin = async (req, res, next) => {
  if (req.session.userid) {
    const { userid } = req.session;
    console.log(userid);
    const userdata = await userModel.findById({ _id: userid });
    console.log("userdata" + userdata);
    if (userdata) {
      if (userdata.is_active === 1) {
        next();
      } else {
        req.session.userid = null;
        res.redirect("/login");
      }
    }
  } else {
    res.redirect("/login");
  }
};

const user_islogout = async (req, res, next) => {
  if (req.session.userid) {
    res.redirect("/usershop");
  } else {
    next();
  }
};

const admin_islogin = async (req, res, next) => {
  if (req.session.adminid) {
    next();
  } else {
    res.redirect("/admin");
  }
};

const admin_islogout = async (req, res, next) => {
  if (req.session.adminid) {
    res.redirect("/admin/home");
  } else {
    next();
  }
};

module.exports = { user_islogin, admin_islogin, admin_islogout, user_islogout };
