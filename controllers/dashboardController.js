const orderModel=require("../models/order")
const filterDate=require("../utils/filter")

const weeklyReport=async(req,res)=>{

    const weeks= filterDate.weeklyData()
    console.log("llll"+weeks)
    console.log("calculating total")
    console.l
    const fourthWeekOrders=await orderModel.aggregate([{$match:{createdAt:{$gte:weeks.fourthWeek,$lte:weeks.fifthWeek}}},{$group:{_id:null,total:{$sum:"$totalprice"}}}])
    const thirdWeekOrders=await orderModel.aggregate([{$match:{createdAt:{$gte:weeks.thirdWeek,$lte:weeks.fourthWeek}}},{$group:{_id:null,total:{$sum:"$totalprice"}}}])
    const secondWeekOrders=await orderModel.aggregate([{$match:{createdAt:{$gte:weeks.secondWeek,$lte:weeks.thirdWeek}}},{$group:{_id:null,total:{$sum:"$totalprice"}}}])
    const firstWeekOrders=await orderModel.aggregate([{$match:{createdAt:{$gte:weeks.firstWeek,$lte:weeks.secondWeek}}},{$group:{_id:null,total:{$sum:"$totalprice"}}}])
    console.log(fourthWeekOrders,thirdWeekOrders,secondWeekOrders,firstWeekOrders)
    res.status(200).json([{week: "week1",count: firstWeekOrders.length > 0 ? firstWeekOrders[0].total : 0},
        {week: "week2", count: secondWeekOrders.length > 0 ? secondWeekOrders[0].total: 0},
        {week: "week3",count: thirdWeekOrders.length > 0 ? thirdWeekOrders[0].total:0 },
        {week: "week4",count:fourthWeekOrders.length > 0 ? fourthWeekOrders[0].total:0}])
 
}
// const monthlyReport=async(req,res)=>{
//     const month =filterDate.monthlyData()
// }

module.exports={weeklyReport}