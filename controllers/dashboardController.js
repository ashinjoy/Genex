const orderModel = require("../models/order");
const filterDate = require("../utils/filter");

const weeklyReport = async (req, res) => {
  const weeks = filterDate.weeklyData();
  console.log("llll" + weeks);
  console.log("calculating total");

  const fourthWeekOrders = await orderModel.aggregate([
    {
      $match: { createdAt: { $gte: weeks.fourthWeek, $lte: weeks.fifthWeek } },
    },
    // { $unwind: "$products" },
    {
      $match: {
        $or: [
          { "products.status": "delivered" },
          { "products.status": "paymentSuccess" },
        ],
      },
    },
    { $group: { _id: null, total: { $sum: "$totalprice" } } },
  ]);
  const thirdWeekOrders = await orderModel.aggregate([
    {
      $match: { createdAt: { $gte: weeks.thirdWeek, $lte: weeks.fourthWeek } },
    },
    { $unwind: "$products" },
    {
      $match: {
        $or: [
          { "products.status": "delivered" },
          { "products.status": "paymentSuccess" },
        ],
      },
    },
    { $group: { _id: null, total: { $sum: "$totalprice" } } },
  ]);
  const secondWeekOrders = await orderModel.aggregate([
    {
      $match: { createdAt: { $gte: weeks.secondWeek, $lte: weeks.thirdWeek } },
    },
    { $unwind: "$products" },
    {
      $match: {
        $or: [
          { "products.status": "delivered" },
          { "products.status": "paymentSuccess" },
        ],
      },
    },
    { $group: { _id: null, total: { $sum: "$totalprice" } } },
  ]);
  const firstWeekOrders = await orderModel.aggregate([
    {
      $match: { createdAt: { $gte: weeks.firstWeek, $lte: weeks.secondWeek } },
    },
    { $unwind: "$products" },
    {
      $match: {
        $or: [
          { "products.status": "delivered" },
          { "products.status": "paymentSuccess" },
        ],
      },
    },
    { $group: { _id: null, total: { $sum: "$totalprice" } } },
  ]);
  console.log(
    fourthWeekOrders,
    thirdWeekOrders,
    secondWeekOrders,
    firstWeekOrders
  );
  res.status(200).json([
    {
      week: "week1",
      count: firstWeekOrders.length > 0 ? firstWeekOrders[0].total : 0,
    },
    {
      week: "week2",
      count: secondWeekOrders.length > 0 ? secondWeekOrders[0].total : 0,
    },
    {
      week: "week3",
      count: thirdWeekOrders.length > 0 ? thirdWeekOrders[0].total : 0,
    },
    {
      week: "week4",
      count: fourthWeekOrders.length > 0 ? fourthWeekOrders[0].total : 0,
    },
  ]);
};

const monthlyreport = async (req, res) => {
  const filtered_Datedata = filterDate.monthlyData();
  console.log(filtered_Datedata);
  let filteredOrders = [];
  for (i = 0; i < filtered_Datedata.length; i++) {
    console.log("initialfilter", filtered_Datedata[i].month);
    console.log(
      "endfilter",
      filtered_Datedata[i + 1] ? filtered_Datedata[i + 1].month : "nill"
    );

    const totalAmount1_Orders = await orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: filtered_Datedata[i].month,
            $lt: filtered_Datedata[i + 1]
              ? filtered_Datedata[i + 1].month
              : Date.now,
          },
        },
      },
      // { $unwind: "$products" },
      {
        $match: {
          $or: [
            { "products.status": "delivered" },
            { "products.status": "paymentSuccess" },
          ],
        },
      },
      { $group: { _id: null, orderTotal: { $sum: "$totalprice" } } },
      { $project: { orderTotal: 1, _id: 0 } },
    ]);
    filteredOrders.push(totalAmount1_Orders);
  }
  console.log(filteredOrders);
  console.log("json data about to send");
  res.status(200).json([{ filtered_Datedata }, { filteredOrders }]);
};

const salesData = async (req, res) => {
  try {
    const { filter } = req.query;
    if (filter == "yearly") {
      const yearlyData = filterDate.yearlyData();
      const yearlySalesreport = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: yearlyData.startingDate,
              $lte: yearlyData.endingDate,
            },
          },
        },
        { $unwind: "$products" },

        {
          $match: {
            $or: [
              { "products.status": "delivered" },
              { "products.status": "paymentSuccess" },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userid",
            foreignField: "_id",
            as: "userdetails",
          },
        },
      ]);
      console.log(yearlySalesreport);
      res.json(yearlySalesreport);
    } else if (filter == "monthly") {
      const monthwiseData = filterDate.monthsale();
      console.log(monthwiseData);
      const monthlySalesreport = await orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: monthwiseData.startingDate,
              $lte: monthwiseData.endingDate,
            },
          },
        },
        { $unwind: "$products" },
        {
          $match: {
            $or: [
              { "products.status": "delivered" },
              { "products.status": "paymentSuccess" },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userid",
            foreignField: "_id",
            as: "userdetails",
          },
        },
      ]);
      console.log(monthlySalesreport);
      res.json(monthlySalesreport);
    } else {
      const dailyData = new Date();
      const startingTime = new Date(dailyData);
       startingTime.setUTCHours(0)
      startingTime.setUTCMinutes(0)
        startingTime.setUTCSeconds(0)
      console.log('startingTime',startingTime)
      const dailyReport= await orderModel.aggregate([
        { $match: { createdAt: { $gte: startingTime, $lte: Date.now } } },
        { $unwind: "$products" },
        {
          $match: {
            $or: [
              { "products.status": "delivered" },
              { "products.status": "paymentSuccess" },
            ],
          },
        },

        {
          $lookup: {
            from: "users",
            localField: "userid",
            foreignField: "_id",
            as: "userdetails",
          },
        },
      ]);
      console.log('dialyrrepory',dailyReport)
      res.json(dailyReport);
    }
   

  } catch (error) {
    console.error(error);
  }
};
const load_salesreport = async (req, res) => {
  try {
    res.render("admin/salesreport");
  } catch (error) {
    console.error(error);
  }
};
module.exports = { weeklyReport, monthlyreport, salesData, load_salesreport };
