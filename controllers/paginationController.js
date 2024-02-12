
const orderModel =require("../models/order")
const pagination=async(req,res)=>{
    const pageNumber= req.query.page
    console.log("pageNumber",pageNumber,"type",typeof(pageNumber))
    const parsedPageNumber=parseInt(pageNumber)
        const limit=8
        const docSkipped=(parsedPageNumber-1)*limit
        const orders=await orderModel.aggregate([{$unwind:"$products"},{$sort:{createdAt:-1}},{$lookup:{from:'users',localField:'userid',foreignField:'_id',as:'userdetails'}},{$skip:docSkipped},{$limit:limit}])

      console.log(orders)
      
      // const orderCount=await orderModel.countDocuments({})
      // console.log(orderCount)
      // const pageLimit=8
      // const totalPage=Math.ceil(orderCount/pageLimit)
      res.json(orders)
}

module.exports={pagination}