const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("../utils/mailer");
const otpgenerate = require("../utils/otp");
const otpModel = require("../models/userOtp");
const productModel = require("../models/productModel");
const categoryModel = require("../models/category");
const logredirect = async (req, res) => {
  try {
    res.redirect("/login");
  } catch (err) {
    console.log(err.message);
  }
};

const Loadlogin = async (req, res) => {
  try {
    res.render("user/userLogin");
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
    console.log("signup entered");
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

      console.log(userDetails);
      const userid = userDetails._id;
      req.session.otp=userid
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
    // const user_id = req.session.otp;
    // console.log(user_id);
    res.render("user/otp_page");
  } catch (err) {
    console.error(err);
  }
};
const sendotp = async (req, res) => {
  try {
    console.log("entered sendotp");
    const otp = otpgenerate.createotp();
    console.log(otp);
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
    const {otp } = req.body;
    const userid=req.session.otp
    const otpverify = await otpModel.findOne({ userid: userid, otp: otp });
    if (otpverify) {
      const verified_user = await userModel.findByIdAndUpdate(
        { _id: userid },
        { is_verified: 1 }
      );
      req.session.otp=null
      res.redirect("/login");
    } else {
      res.render("user/otp_page", { otperror: "THIS OTP IS INVALID" });
      // setTimeout(async () => {
      //   await userModel.findByIdAndDelete({ _id: userid });
      // }, 120000);
    }
  } catch (err) {
    console.error(err);
  }
};

const login = async (req, res) => {
  try {
    console.log("entered login");
    const { email, password } = req.body;
    console.log(email)
    const loggeduser = await userModel.findOne({ email: email });
console.log(loggeduser)
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
    }
    else{
      console.log('Please Signup')
    
    }
  } catch (err) {
    console.error(err);
  }
};
// const load_userhome=async(req,res)=>{
//   try {
//     res.render("user/userhome")
//   } catch (error) {
//     console.error(error)
//   }
// }
const load_usershop = async (req, res) => {
  try {
    const product = await productModel
      .find({ is_active: true })
      .populate("category");
    const filtered = product.filter((data) => {
      if (data.category.status === true) {
        return data;
      }
    });
    res.render("user/usershop", { filtered });
  } catch (err) {
    console.log(err);
  }
};

const load_productdetail = async (req, res) => {
  const { id } = req.query;
  const product = await productModel.findById({ _id: id }).populate("category");
  console.log(product)
  res.render("user/productdetail", { product });
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

  // load_userhome
};
