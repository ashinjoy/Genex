const userOtp = require("../models/userOtp");
function createotp() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); //otp  generated using math.random
  return otp;
}

module.exports = { createotp };
