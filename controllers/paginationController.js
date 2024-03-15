const orderModel = require("../models/order");
const productModel = require("../models/productModel");
const pagination = async (req, res) => {
  const pageNumber = req.query.page;
  console.log("pageNumber", pageNumber, "type", typeof pageNumber);
  const parsedPageNumber = parseInt(pageNumber);
  const limit = 8;
  const docSkipped = (parsedPageNumber - 1) * limit;
  const orders = await orderModel.aggregate([
    { $unwind: "$products" },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "userid",
        foreignField: "_id",
        as: "userdetails",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "products.productid",
        foreignField: "_id",
        as: "productdetails",
      },
    },
    { $skip: docSkipped },
    { $limit: limit },
  ]);

  console.log(orders);

  // const orderCount=await orderModel.countDocuments({})
  // console.log(orderCount)
  // const pageLimit=8
  // const totalPage=Math.ceil(orderCount/pageLimit)
  res.json(orders);
};

const orderPagination = async (req, res) => {
  try {
    const pageNumber = req.query.page;
    console.log("pageNumber", pageNumber, "type", typeof pageNumber);
    const parsedPageNumber = parseInt(pageNumber);
    const limit = 8;
    const docSkipped = (parsedPageNumber - 1) * limit;
    const orders = await orderModel.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      { $skip: docSkipped },
      { $limit: limit },
    ]);
    res.json(orders);
  } catch (error) {
    console.error(error);
  }
};

const productPagination = async (req, res) => {
  try {
    const pageNumber = req.query.page || 1;
    const parsedPageNumber = parseInt(pageNumber);
    const limit = 8;
    const docSkipped = (parsedPageNumber - 1) * limit;
    const orders = await productModel.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categorydetails",
        },
      },
      { $unwind: "$categorydetails" },
      { $match: { "categorydetails.status": true } },
      { $skip: docSkipped },
      { $limit: limit },
    ]);
    console.log(orders);
    res.json(orders);
  } catch (error) {
    console.error(error);
  }
};

module.exports = { pagination, orderPagination, productPagination };
