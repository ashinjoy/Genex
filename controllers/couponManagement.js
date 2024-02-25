const couponModel = require("../models/coupon");
const load_addCoupon = async (req, res) => {
  try {
    res.render("admin/addCoupon");
  } catch (error) {
    console.error(error);
  }
};
const addCoupon = async (req, res) => {
  try {
    const { couponName, desc, couponCode, limit, reductionRate } = req.body;
    const coupon = {
      name: couponName,
      description: desc,
      couponCode: couponCode,
      couponlimit: limit,
      reductionRate: reductionRate,
    };
    const couponCreate = await couponModel.create(coupon);
    res.redirect("/admin/listCoupon");
  } catch (error) {
    console.error(error);
  }
};
const listCoupon = async (req, res) => {
  try {
    const couponsAvailable = await couponModel.find({ is_active: true });
    res.render("admin/couponlist", { couponsAvailable });
  } catch (error) {
    console.error(error);
  }
};
const loadEditCoupon = async (req, res) => {
  try {
    const { id } = req.query;
    const editCoupon = await couponModel.findById({ _id: id });
    res.render("admin/editCoupon", { editCoupon });
  } catch (error) {
    console.error(error);
  }
};
const editCoupon = async (req, res) => {
  try {
    const { couponName, desc, couponCode, limit, reductionRate, couponid } =
      req.body;
    const coupon = {
      name: couponName,
      description: desc,
      couponCode: couponCode,
      couponlimit: limit,
      reductionRate: reductionRate,
    };
    const updateCoupon = await couponModel.findByIdAndUpdate(
      { _id: couponid },
      { $set: coupon }
    );
    res.redirect("/admin/listCoupon");
  } catch (error) {
    console.error(error);
  }
};
const blockStatus = async (req, res) => {
  try {
    const { id } = req.body;
    const updateStatus = await couponModel.findByIdAndUpdate(
      { _id: id },
      { $set: { status: false } }
    );
    res.status(200).json({ data: "success" });
  } catch (error) {
    console.error(error);
  }
};
const unblockStatus = async (req, res) => {
  try {
    const { id } = req.body;
    const unblockStatus = await couponModel.findByIdAndUpdate(
      { _id: id },
      { $set: { status: true } }
    );
    res.status(200).json({ data: "success" });
  } catch (error) {
    console.error(error);
  }
};
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.body;
    const deleteStatus = await couponModel.findByIdAndUpdate(
      { _id: id },
      { $set: { is_active: false } }
    );
    res.status(200).json({ data: "success" });
  } catch (error) {
    console.error(error);
  }
};
module.exports = {
  load_addCoupon,
  addCoupon,
  listCoupon,
  loadEditCoupon,
  editCoupon,
  blockStatus,
  unblockStatus,
  deleteCoupon,
};
