const product = require("../models/productModel");
const searchProducts = async (req, res) => {
  try {
    const { search } = req.query;
    const searchResult=search.toUpperCase()
    console.log(searchResult)
    const searchitems = new RegExp(search, "i");
    const searchResults = await product.find({
      name: { $regex: searchitems },
    })
    console.log(searchResults);
    res.render("user/shopfilterpage", { searchResults });
  } catch (error) {
    console.error(error);
  }
};
module.exports = { searchProducts };
