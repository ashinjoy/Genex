const addressModel = require("../models/address");

const load_addAddress = async (req, res) => {
  try {
    const { page } = req.query;
    res.render("user/addAddress", { page });
  } catch (error) {
    console.error(error);
  }
};
const addAddress = async (req, res) => {
  try {
    const { userid } = req.session;
    const {
      name,
      houseno,
      landmark,
      pincode,
      city,
      state,
      phone,
      email,
      country,
      source,
    } = req.body;
    const address = {
      name: name,
      houseno: houseno,
      landmark: landmark,
      pincode: pincode,
      phone: phone,
      email: email,
      city: city,
      state: state,
      country: country,
      userid: userid,
    };
    const addressStore = await addressModel.create(address);
    console.log("address", addressStore);
    console.log(req.body.source);
    if (req.body.source == "checkout") {
      res.redirect("/checkout");
    } else {
      console.log("bgsvjssxaj");
      res.redirect("/listaddress");
    }
  } catch (error) {
    console.error(error);
  }
};
const load_editAddress = async (req, res) => {
  try {
    const { id, page } = req.query;
    const address = await addressModel.findById({ _id: id });
    res.render("user/editAddress", { address, page });
  } catch (error) {
    console.error(error);
  }
};

const editAddress = async (req, res) => {
  try {
    console.log("entered editAddress");
    const { userid } = req.session;
    const {
      name,
      houseno,
      landmark,
      pincode,
      city,
      state,
      phone,
      email,
      country,
      addressid,
      source,
    } = req.body;
    console.log("addressid" + addressid);

    const editAddress = await addressModel.findByIdAndUpdate(
      { _id: addressid },
      {
        $set: {
          name: name,
          houseno: houseno,
          landmark: landmark,
          pincode: pincode,
          phone: phone,
          email: email,
          city: city,
          state: state,
          country: country,
          userid: userid,
        },
      }
    );
    console.log(editAddress);
    console.log("source", req.body.source);
    if (req.body.source == "checkout") {
      res.redirect("/checkout");
    } else {
      console.log("dkbkjdbskd");
      res.redirect("/listaddress");
    }
  } catch (error) {
    console.error(error);
  }
};

const listAddress = async (req, res) => {
  try {
    const { userid } = req.session;
    const userAdrress = await addressModel.find({ userid: userid });
    res.render("user/addresslist", { userAdrress });
  } catch (error) {
    console.error(error);
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.query;
    const deleteAddress = await addressModel.findByIdAndDelete({ _id: id });
    res.redirect("/listaddress");
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  load_addAddress,
  addAddress,
  load_editAddress,
  editAddress,
  listAddress,
  deleteAddress,
};
