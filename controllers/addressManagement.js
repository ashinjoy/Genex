const addressModel = require("../models/address");

const load_addAddress = async (req, res) => {
  try {
    res.render("user/addAddress");
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
    if (addressStore) {
      res.redirect("/checkout");
    }
  } catch (error) {
    console.error(error);
  }
};
const load_editAddress = async (req, res) => {
  try {
    const { id } = req.query;
    const address = await addressModel.findById({ _id: id });
    res.render("user/editAddress", { address });
  } catch (error) {
    console.error(error);
  }
};

const editAddress = async (req, res) => {
  try {
    console.log("entered editAddress")
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

    res.redirect("/checkout");
  } catch (error) {
    console.error(error);
  }
};

const listAddress=async(req,res)=>{
  try {
    const {userid}=req.session
    const userAdrress=await addressModel.find({userid:userid})
    res.render("user/addresslist",{userAdrress})
  } catch (error) {
    console.error(error)
  }
}

const deleteAddress=async(req,res)=>{
  try {
    const {id}=req.query
    const deleteAddress=await addressModel.findByIdAndDelete({_id:id})
    res.redirect("user/listaddress")
    
  } catch (error) {
    console.error(error)
  }
}

module.exports = { load_addAddress, addAddress, load_editAddress, editAddress ,listAddress,deleteAddress};
