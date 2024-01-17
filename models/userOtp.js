const mongoose = require("mongoose");
const otpSchema = new mongoose.Schema({
  userid: { type:mongoose.Types.ObjectId, required: true },
  otp: { type: String, required: true },
});
const otpModel = mongoose.model("otp", otpSchema);
module.exports = otpModel;
