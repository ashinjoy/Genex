const productModel = require("../models/productModel");
const product = require("../models/productModel");
const category = require("../models/category");
const categoryModel = require("../models/category");
const { default: mongoose } = require("mongoose");
const orderModel = require("../models/order");
const searchProducts = async (req, res) => {
  try {
    const { search, filter } = req.query;
    console.log(filter);
    if (filter.split(",")[1] != undefined) {
      const catId = filter.split(",")[0];
      const categoryObjectId = new mongoose.Types.ObjectId(catId);

      const searchResult = search.toUpperCase();
      console.log(searchResult);
      const searchitems = new RegExp(search, "i");
      const searchResults = await productModel.aggregate([
        { $match: { category: categoryObjectId, is_active: true } },
        { $match: { name: { $regex: searchitems } } },
      ]);
      console.log(searchResults);
      res.status(200).json(searchResults);
    } else if (filter === "allProducts") {
      const skippedLimit = console.log("hello entryyyyyy");
      const searchResult = search.toUpperCase();
      console.log(searchResult);
      const searchitems = new RegExp(search, "i");
      const searchResults = await product
        .find({
          name: { $regex: searchitems },
          is_active: true,
        })
        .limit(8);
      console.log(searchResults);
      res.status(200).json(searchResults);
    } else if (filter === "low") {
      const searchResult = search.toUpperCase();
      console.log(searchResult);
      const searchitems = new RegExp(search, "i");
      const searchResults = await product
        .find({
          name: { $regex: searchitems },
          is_active: true,
        })
        .sort({ salesprice: 1 });
      console.log(searchResults);
      res.json(searchResults);
    } else {
      const searchResult = search.toUpperCase();
      console.log(searchResult);
      const searchitems = new RegExp(search, "i");
      const searchResults = await product
        .find({
          name: { $regex: searchitems },
          is_active: true,
        })
        .sort({ salesprice: -1 });
      console.log(searchResults);
      res.json(searchResults);
    }
  } catch (error) {
    console.error(error);
  }
};

const filterProduct = async (req, res) => {
  try {
    const filter = req.query.filter;

    console.log(filter);
    if (filter.split(",")[1] != undefined) {
      const catId = filter.split(",")[0];
      const categoryFilter = await productModel.find({
        is_active: true,
        category: catId,
      });

      res.status(200).json(categoryFilter);
    }
    if (filter === "allProducts") {
      console.log("entered All Products");
      const allProducts = await productModel.find({ is_active: true });

      console.log(allProducts);
      res.status(200).json(allProducts);
    } else if (filter === "low") {
      console.log("enterde low high");
      const lowHighProducts = await productModel
        .find({ is_active: true })
        .sort({ salesprice: 1 });

      console.log(lowHighProducts);
      res.status(200).json(lowHighProducts);
    } else if (filter === "high") {
      console.log("entered high low");
      const highLowProducts = await productModel
        .find({ is_active: true })
        .sort({ salesprice: -1 });

      console.log(highLowProducts);
      res.status(200).json(highLowProducts);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { searchProducts, filterProduct };
