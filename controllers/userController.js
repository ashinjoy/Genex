const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("../utils/mailer");
const otpgenerate = require("../utils/otp");
const otpModel = require("../models/userOtp");
const productModel = require("../models/productModel");
const categoryModel = require("../models/category");
const logredirect = async (req, res) => {
  try {
    res.redirect("/userhome");
  } catch (err) {
    console.log(err.message);
  }
};

const Loadlogin = async (req, res) => {
  try {
    const successMsg = req.query ? req.query.message : null;
    res.render("user/userLogin", { successMsg });
  } catch (err) {
    console.log(err.message);
  }
};
const Loadsignup = async (req, res) => {
  try {
    res.render("user/userSignup");
  } catch (err) {
    console.log(err.message);
  }
};
const signup = async (req, res) => {
  try {
    const { name, email, phone, password, confirm_password } = req.body;
    if (password === confirm_password) {
      let saltrounds = 13;
      const hashedpassword = await bcrypt.hash(password, saltrounds);
      const userData = {
        uname: name,
        email: email,
        phone: phone,
        password: hashedpassword,         
      };
      const userDetails = await userModel.create(userData);
      const userid = userDetails._id;
      req.session.otp = userid;
      if (req.query.ref) {
      req.session.ref = req.query.ref;
      }
      res.redirect("/email-verification");
    } else {
      res.render("user/userSignup", {
        confirm: "please enter the correct Matching password",
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};

const Load_otppage = async (req, res) => {
  try {
    res.render("user/otp_page");
  } catch (err) {
    console.error(err);
  }
};
const sendotp = async (req, res) => {
  try {
    const otp = otpgenerate.createotp();
    const id = req.session.otp;
    if (!id) {
      console.log("invalid user_id");
    }
    const otpdetails = {
      userid: id,
      otp: otp,
    };
    const otpdata = await otpModel.create(otpdetails);
    console.log(otpdata);

    setTimeout(async () => {
      try {
        const deletedotp = await otpModel.deleteOne({ userid: id });
        if (deletedotp) {
          console.log("otp document deleted succesfully");
        }
      } catch (err) {
        console.error(err);
      }
    }, 60000);
    const userdoc = await userModel.findById({ _id: id });  
    console.log(userdoc);
    const useremail = userdoc.email;
    console.log(useremail);
    nodemailer.sendMail(otp, useremail);
  } catch (err) {
    console.error(err);
  }
};
 
const verifyotp = async (req, res) => {
  try {
    const { otp } = req.body;
    const userid = req.session.otp;
    const otpverify = await otpModel.findOne({ userid: userid, otp: otp });
    if (otpverify) {
      const verified_user = await userModel.findByIdAndUpdate(
        { _id: userid }, 
        { is_verified: 1 }
      );
      // generate referral String for all sucesfully verified user
      const refferalString = `${req.headers.host}/signup?ref=${userid}`;
      const reffreallink = await userModel.findByIdAndUpdate(
        { _id: userid },
        { $set: { referralString: refferalString } }
      );
      console.log("referral", req.session.ref);

      if (req.session.ref) {
        console.log("vdgh referene");
        const { ref } = req.session;
        console.log("refff", ref);
        const refernceValid = await userModel.findById({ _id: ref });
        console.log("docm", refernceValid);
        if (refernceValid) {
          await userModel.findByIdAndUpdate(
            { _id: ref },
            { $inc: { WalletBalance: 100 } }
          );
        }
      }
      req.session.ref = null;

      req.session.otp = null;

      const success = "User Successfully verified";
      res.status(200).json(success);
    } else {
      const error = "Invalid OTP";
      res.status(403).json(error);
    }
  } catch (err) {
    console.error(err);
  }
};

const login = async (req, res) => {
  try {
    console.log("entered login");
    const { email, password } = req.body;
    console.log(email);
    const loggeduser = await userModel.findOne({ email: email });
    console.log(loggeduser);
    if (loggeduser) {
      const userpassword = await bcrypt.compare(password, loggeduser.password);
      if (userpassword) {
        console.log("user");
        if (loggeduser.is_verified === 1 && loggeduser.is_admin === 0) {
          console.log(loggeduser._id);
          req.session.userid = loggeduser._id;
          res.redirect("/usershop");
        } else {
          res.render("user/userLogin", {
            not_verified: "Please verify your email",
          });
        }
      } else {
        res.render("user/userLogin", { error: "Invalid Credentials" });
      }
    } else {
      res.render("user/userLogin", { noSignup: "Please Sign Up " });
    }
  } catch (err) {
    console.error(err);
  }
};
const load_userhome = async (req, res) => {
  try {
    const categoryAvailable = await categoryModel
      .find({ status: true })
      .sort({ created_at: -1 })
      .limit(4);

    const productAvailable = await productModel
      .find({ is_active: true })
      .sort({created_at:-1})         
      .limit(4);

    res.render("user/userhome", { categoryAvailable, productAvailable });
  } catch (error) {
    console.error(error);
  }
};
const load_usershop = async (req, res) => {
  try {

    const currentPage=req.query.page || 1 
    const skipdoc=(parseInt(currentPage)-1) * 8
    const product = await productModel
      .find({ is_active: true }).skip(skipdoc).limit(8)       
      .populate("category");
      const pagelimit=8
      const totaldoc=await productModel.countDocuments({is_active:true})
      const totalbtn=Math.ceil(totaldoc/pagelimit)
    const filtered = product.filter((data) => {   
      if (data.category.status === true) {
        return data;
      }
    });

    res.render("user/usershop", { filtered,totalbtn });
  } catch (err) {
    console.log(err);
  }
};

const load_productdetail = async (req, res) => {
  const { id } = req.query;
  const product = await productModel.findById({ _id: id }).populate("category");
  const relatedProducts = await productModel.aggregate([
    {
      $match: {
        $and: [
          { _id: { $ne: product._id } },
          { category: product.category._id },
        ],
      },
    },
  ]);
  console.log("relatedProducts", relatedProducts);
  console.log(product);
  res.render("user/productdetail", { product, relatedProducts });
};

const logout = async (req, res) => {
  req.session.userid = null;
  res.redirect("/userhome");
};

module.exports = {
  logredirect,
  Loadlogin,
  Loadsignup,
  signup,
  Load_otppage,
  sendotp,
  verifyotp,
  login,
  load_usershop,
  load_productdetail,
  load_userhome,
  logout,
};
