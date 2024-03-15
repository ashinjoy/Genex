var easyinvoice = require("easyinvoice");
async function generateInvoice(order) {
  try {
    console.log("data in invoice", order);
    console.log(typeof order[0].createdAt);

    var data = {
      images: {
        logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
        background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
      },
      sender: {
        company: "Genex",
        address: "Ernakulam",
        zip: "683562",
        city: "Kizahkkambalam",
        country: "India",
      },
      client: {
        company: order ? order[0].addressDetail[0].name : "nodata",
        address: order ? order[0].addressDetail[0].houseno : "nodata",
        zip: order ? order[0].addressDetail[0].pincode : "nodata",
        city: order ? order[0].addressDetail[0].city : "nodata",
        country: order ? order[0].addressDetail[0].country : "nodata",
      },
      information: {
        number: "2022.0001",
        date: order[0].createdAt.toLocaleDateString(),
        "due-date": Date.now(),
      },
      products: order[0].products.map((product) => ({
        quantity: product.qty,
        description: order[0].productDetails[0].name,
        taxRate: 0,
        price:
          order[0].productDetails[0].offerPrice > 0
            ? order[0].productDetails[0].offerPrice
            : order[0].productDetails[0].salesprice,
      })),
      "bottom-notice": "Kindly pay your invoice within 15 days.",
      settings: {
        currency: "INR",
        "tax-notation": "vat",
        "margin-top": 25,
        "margin-right": 25,
        "margin-left": 25,
        "margin-bottom": 25,
      },
    };

    console.log(data);
    //Create your invoice! Easy!
    return await easyinvoice.createInvoice(data);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { generateInvoice };
