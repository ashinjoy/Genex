const userOtp = require("../models/userOtp");
function createotp() {
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); //otp  generated using math.random
  return otp;
}

module.exports = { createotp };
