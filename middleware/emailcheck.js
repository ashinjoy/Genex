const userModel = require("../models/userModel");

const isvalid_email = async (req, res, next) => {
  const { email, phone } = req.body;
  const email_exist = await userModel.findOne({ email: email });
  const phone_exist = await userModel.findOne({ phone: phone });

  if (email_exist && phone_exist) {
    res.render("user/userSignup", {
      combined_err:
        "Account with the following phonenumber and emailid already exists",
    });
  } else if (email_exist) {
    res.render("user/userSignup", {
      email_err: "Account with the following email_id already exists",
    });
  } else if (phone_exist) {
    res.render("user/userSignup", {
      phone_err: "Account with the following phonenumber already exists",
    });
  } else {
    next();
  }
};
module.exports = isvalid_email;
