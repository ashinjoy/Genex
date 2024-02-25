const is_otp = async (req, res, next) => {
  if (req.session.otp) {
    next();
  } else {
    res.redirect("/signup");
  }
};
module.exports = is_otp;
