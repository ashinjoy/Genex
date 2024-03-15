const categoryModel = require("../models/category");
const productModel = require("../models/productModel");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const order = require("../models/order");

const load_addproduct = async (req, res) => {
  try {
    console.log(req.originalUrl);
    const catdetail = await categoryModel
      .find({ status: true })
      .sort({ created_at: -1 });
    res.render("admin/addproduct", { catdetail });
  } catch (error) {
    console.error(error);
  }
};

const add_product = async (req, res) => {
  try {
    const {
      pname,
      description,
      // reg_price,
      sales_price,
      cat,
      small_qty,
      medium_qty,
      large_qty,
    } = req.body;
    const images = req.files;
    const imgPromises = images.map(async (img) => {
      console.log("hello");
      const imgPath = img.path;
      const outputpath = path.join(
        __dirname,
        "../assets",
        "crop" + img.filename
      );
      await sharp(imgPath)
        .resize({ width: 650, height: 500, fit: "outside" })
        .toFile(outputpath);

      return outputpath;
    });

    const croppedImgPaths = await Promise.all(imgPromises);
    const croppedImgfilename = croppedImgPaths.map((img) => {
      return path.basename(img);
    });

    console.log(croppedImgfilename);

    console.log(req.files);
    const productdetail = {
      name: pname,
      description: description,
      category: cat,
      // regularprice: reg_price,
      salesprice: sales_price,
      size: [
        { label: "small", quantity: small_qty },
        { label: "medium", quantity: medium_qty },
        { label: "large", quantity: large_qty },
      ],
      img: croppedImgfilename,
    };
    const products = await productModel.findOne({ name: pname });
    if (!products) {
      const productdata = await productModel.create(productdetail);
    } else {
      console.log("duplicate product");
    }

    res.redirect("/admin/products/addproduct");
  } catch (error) {
    console.error(error);
  }
};

const load_productlist = async (req, res) => {
  try {
    const products = await productModel.find({}).populate("category");
    console.log(products);
    const filteredproducts = products.filter((data) => {
      if (data.category.status === true) {
        return data;
      }
    });
    const productsCount = await productModel.countDocuments({});
    const limit = 8;
    const totalPageNumber = Math.ceil(productsCount / limit);

    res.render("admin/productlist", { filteredproducts, totalPageNumber });
  } catch (error) {
    console.log(error);
  }
};
const product_block = async (req, res) => {
  try {
    const { id } = req.query;
    const product = await productModel.findByIdAndUpdate(
      { _id: id },
      { $set: { is_active: false } }
    );
    res.status(200).json({ data: "success" });
  } catch (error) {
    console.error(error);
  }
};
const product_unblock = async (req, res) => {
  try {
    const { id } = req.query;
    const product = await productModel.findByIdAndUpdate(
      { _id: id },
      { $set: { is_active: true } }
    );
    res.status(200).json({ data: "success" });
  } catch (error) {
    console.error(error);
  }
};
const load_editproduct = async (req, res) => {
  try {
    const { id } = req.query;
    const dataproduct = await productModel
      .findById({ _id: id })
      .populate("category");
    const category = await categoryModel.find({
      _id: { $ne: dataproduct.category._id },
    });
    res.render("admin/editproduct", { dataproduct, category });
  } catch (err) {
    console.error(err);
  }
};
const editproduct = async (req, res) => {
  try {
    const {
      pname,
      description,
      // reg_price,
      sales_price,
      cat,
      small_qty,
      medium_qty,
      large_qty,
      pid,
    } = req.body;
    const images = req.files;
    console.log("files" + images);

    if (req.files.length === 0) {
      const editedproduct = await productModel.findByIdAndUpdate(
        { _id: pid },
        {
          $set: {
            name: pname,
            description: description,
            category: cat,
            // regularprice: reg_price,
            salesprice: sales_price,
            size: [
              { label: "small", quantity: small_qty },
              { label: "medium", quantity: medium_qty },
              { label: "large", quantity: large_qty },
            ],
          },
        }
      );
      console.log(editedproduct, "editedproduct");
    } else {
      const imgfilename = images.map((img) => {
        return img.filename;
      });
      console.log(imgfilename);
      const editedproduct = await productModel.findByIdAndUpdate(
        { _id: pid },
        {
          $set: {
            name: pname,
            description: description,
            category: cat,
            // regularprice: reg_price,
            salesprice: sales_price,
            size: [
              { label: "small", quantity: small_qty },
              { label: "medium", quantity: medium_qty },
              { label: "large", quantity: large_qty },
            ],
            img: imgfilename,
          },
        },
        { new: true }
      );
      console.log("edited" + editedproduct);
    }
    res.redirect("/admin/products/productlist");
  } catch (error) {
    console.error(error);
  }
};

const bestProducts = async (req, res) => {
  try {
    const bestTenProducts = await order.aggregate([
      { $unwind: "$products" },
      { $match: { "products.status": "delivered" } },
      {
        $group: {
          _id: "$products.productid",
          totalQuantity: { $sum: "$products.qty" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productdetail",
        },
      },
    ]);
    res.render("admin/bestsellingProducts", { bestTenProducts });
    console.log(bestTenProducts);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  load_addproduct,
  add_product,
  load_productlist,
  product_block,
  product_unblock,
  load_editproduct,
  editproduct,
  bestProducts,
};
