const { default: mongoose } = require("mongoose");
const categoryModel = require("../models/category");
const offerModel = require("../models/offerModel");
const productModel = require("../models/productModel");

const load_offerPage = async (req, res) => {
  try {
    const products = await productModel.find({ is_active: true });
    const category = await categoryModel.find({ status: true });
    const offers = await offerModel
      .find({})
      .populate("productid")
      .populate("categoryid");
    console.log("offerspopulated", offers);
    res.render("admin/offer", { products, category, offers });
  } catch (error) {
    console.error(error);
  }
};

const updateOfferprice = async (productobjId) => {
  console.log("helo guyz");
  console.log("objid", productobjId);
  const offeramont = await productModel.aggregate([
    { $match: { _id: productobjId } },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "catdetail",
      },
    },
    {
      $lookup: {
        from: "offers",
        localField: "catdetail.offer",
        foreignField: "_id",
        as: "catOffer",
      },
    },

    {
      $lookup: {
        from: "offers",
        localField: "offer",
        foreignField: "_id",
        as: "productOffer",
      },
    },

    {
      $addFields: {
        productofferPercentage: {
          $ifNull: [
            { $arrayElemAt: ["$productOffer.discountPercentage", 0] },
            null,
          ],
        },
        categoryofferPercentage: {
          $ifNull: [
            { $arrayElemAt: ["$catOffer.discountPercentage", 0] },
            null,
          ],
        },
      },
    },
    {
      $addFields: {
        maxOfferPercentage: {
          $cond: {
            if: {
              $gte: ["$productofferPercentage", "$categoryofferPercentage"],
            },
            then: "$productofferPercentage",
            else: "$categoryofferPercentage",
          },
        },
      },
    },
    {
      $addFields: {
        deduction: {
          $divide: [{ $multiply: ["$salesprice", "$maxOfferPercentage"] }, 100],
        },
      },
    },
    {
      $addFields: {
        offerprice: {
          $subtract: ["$salesprice", "$deduction"],
        },
      },
    },
    {
      $project: {
        offerprice: 1,
        _id: 0,
      },
    },
  ]);

  console.log("pipeline result", offeramont);
  const [{ offerprice }] = offeramont;
  const roundedOfferprice = Math.ceil(offerprice);
  console.log(offerprice);
  // console.log('offerprice',offerprice)
  const offerPrice = await productModel.findByIdAndUpdate(
    { _id: productobjId },
    { $set: { offerPrice: roundedOfferprice } }
  );
  console.log(offerPrice);
};

const createOffer = async (req, res) => {
  try {
    const { offertype, product, category, discountRate } = req.body;
    let discountpercent = parseInt(discountRate);

    let offer;
    const productObjectId = new mongoose.Types.ObjectId(product);
    const categoryObjectId = new mongoose.Types.ObjectId(category);

    if (offertype === "product") {
      const product = await productModel.aggregate([
        { $match: { _id: productObjectId } },
        {
          $lookup: {
            from: "offers",
            localField: "offer",
            foreignField: "_id",
            as: "offer",
          },
        },
      ]);
      if (product[0].offer[0]) {
        res.render("admin/offer", {
          offerExists: "Offer Already Exists in the product",
        });
      } else {
        offer = await offerModel.create({
          offertype: offertype,
          productid: productObjectId,
          discountPercentage: discountpercent,
        });
        // updating offer inside productModel
        const updateOffer = await productModel.findByIdAndUpdate(
          { _id: productObjectId },
          { $set: { offer: offer._id } }
        );

        console.log("updateofferssss", updateOffer);
        console.log("ppid", productObjectId);
        const update_Offerprice = await updateOfferprice(productObjectId);
      }
    } else {
      const category = await categoryModel.aggregate([
        { $match: { _id: categoryObjectId } },
        {
          $lookup: {
            from: "offers",
            localField: "offer",
            foreignField: "_id",
            as: "offer",
          },
        },
      ]);
      if (category[0].offer[0]) {
        res.render("admin/offer", {
          offerExists: "Offer Already Exists in the product",
        });
      } else {
        offer = await offerModel.create({
          offertype: offertype,
          categoryid: categoryObjectId,
          discountPercentage: discountpercent,
        });
        // updating offer inside productModel
        const updateOffer = await categoryModel.updateOne(
          { _id: categoryObjectId },
          { $set: { offer: offer._id } }
        );

        //calculate Dicount price
        let products = [];
        const categoryProducts = await productModel.aggregate([
          { $match: { category: categoryObjectId } },
        ]);
        console.log("catpro", categoryProducts);
        for (const product of categoryProducts) {
          const productId = product._id;
          products.push(productId);
        }
        console.log("catproid", products);
        for (const productId of products) {
          await updateOfferprice(productId);
        }
      }
    }

    res.redirect("/admin/offer");

    // console.log("request Body", req.body);
  } catch (error) {
    console.error(error);
  }
};

const deleteOffer = async (req, res) => {
  try {
    const { id } = req.query;
    const offerdata = await offerModel.findById({ _id: id });
    if (offerdata.offertype === "category") {
      const productofferUpdate = await productModel.updateMany(
        { category: offerdata.categoryid },
        { $set: { offerPrice: 0 } }
      );
      const updatecategoryOffer = await categoryModel.updateOne(
        { _id: offerdata.categoryid },
        { $unset: { offer: 1 } }
      );
      const updateoffer = await offerModel.findByIdAndDelete({ _id: id });
    } else {
      console.log("pid", offerdata.productid);
      const productofferUpdate = await productModel.findByIdAndUpdate(
        { _id: offerdata.productid },
        { $set: { offerPrice: 0 } }
      );
      const updateproductOffer = await productModel.updateOne(
        { _id: offerdata.productid },
        { $unset: { offer: 1 } }
      );
      const updateoffer = await offerModel.findByIdAndDelete({ _id: id });
    }

    res.status(200).json({ success: "deleted Successfully" });
  } catch (error) {
    console.error(error);
  }
};
// const load_editOffer = async (req, res) => {
//   try {
//     const { id } = req.query;
//     const products = await productModel.find({ is_active: true });
//     const category = await categoryModel.find({ status: true });
//     const offerDetail = await offerModel
//       .findById({ _id: id })
//       .populate("productid")
//       .populate("categoryid");
//     console.log(offerDetail);
//     res.render("admin/editOffer", { offerDetail });
//   } catch (error) {
//     console.error(error);
//   }
// };

// const editOffer = async (req, res) => {
//   try {
//     const { offertype, product, category, discountRate } = req.body;
//     let discountpercent = parseInt(discountRate);

//     let offer;
//     const productObjectId = new mongoose.Types.ObjectId(product);
//     const categoryObjectId = new mongoose.Types.ObjectId(category);

//     if (offertype === "product") {
// const product = await productModel.aggregate([
//   { $match: { _id: productObjectId } },
//   {
//     $lookup: {
//       from: "offers",
//       localField: "offer",
//       foreignField: "_id",
//       as: "offer",
//     },
//   },
// ]);

// offer = await offerModel.findByIdAndUpdate(
//   { _id: id },
//   {
//     $set: {
//       offertype: offertype,
//       productid: productObjectId,
//       discountPercentage: discountpercent,
//     },
//   }
// );
// updating offer inside productModel
//   const updateOffer = await productModel.findByIdAndUpdate(
//     { _id: productObjectId },
//     { $set: { offer: offer._id } }
//   );

//   console.log("updateofferssss", updateOffer);
//   console.log("ppid", productObjectId);
//   const update_Offerprice = await updateOfferprice(productObjectId);
// } else {
// const category = await categoryModel.aggregate([
//   { $match: { _id: categoryObjectId } },
//   {
//     $lookup: {
//       from: "offers",
//       localField: "offer",
//       foreignField: "_id",
//       as: "offer",
//     },
//   },
// ]);

// offer = await offerModel.findByIdAndUpdate(
//   { _id: id },
//   {
//     $set: {
//       offertype: offertype,
//       categoryid: categoryObjectId,
//       discountPercentage: discountpercent,
//     },
//   }
// );
// updating offer inside productModel
// const updateOffer = await categoryModel.updateOne(
//   { _id: categoryObjectId },
//   { $set: { offer: offer._id } }
// );

//calculate Dicount price
//     let products = [];
//     const categoryProducts = await productModel.aggregate([
//       { $match: { category: categoryObjectId } },
//     ]);
//     console.log("catpro", categoryProducts);
//     for (const product of categoryProducts) {
//       const productId = product._id;
//       products.push(productId);
//     }
//     console.log("catproid", products);
//     for (const productId of products) {
//       await updateOfferprice(productId);
//     }
//   }

//   res.redirect("/admin/offer");
// } catch (error) {
//   console.error;
// }
// };

module.exports = {
  load_offerPage,
  createOffer,
  deleteOffer,
};
