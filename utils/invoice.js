var easyinvoice = require('easyinvoice');
async function  generateInvoice (client,order){
    console.log("data in invoice",order)
    // var data = {
    //     apiKey: "free", // Please register to receive a production apiKey: https://app.budgetinvoice.com/register
    //     mode: "development", // Production or development, defaults to production   
     
    //     sender: {
    //         company: "Genex clothing Limited",
    //         address: "Near Crown Plaza Ernakulam,Kundannor",
    //         zip: "1234 AB",
    //         city: "Ernakulam",
    //         country: "India"
           
    //         // custom3: "custom value 3"
    //     },
    //     // Your recipient
    //     client: {
    //         company:order ? order[0].addressDetail[0].name:'nodata',
    //         address:order ? order[0].addressDetail[0].houseno:'nodata',
    //         zip:order ? order[0].addressDetail[0].pincode:'nodata' ,
    //         city:order ? order[0].addressDetail[0].city:'nodata',
    //         country:order ? order[0].addressDetail[0].country:'nodata'

    //     },
    //     information: {
    //         // Invoice number
    //         number: "2021.0001",
    //         // Invoice data
    //         date: new Date().toDateString,
    //         // Invoice due date
          
    //     },
    //     // The products you would like to see on your invoice
    //     // Total values are being calculated automatically
        
    //         products: order[0].products.map((product)=>({
    //         productName:order[0].productDetails[0].name,
    //         quantity:product.qty,
    //         size:product.size,
    //         unitPrice:order[0].productDetails[0].salesprice
    //     })),

    // };
    var data = {
        apiKey: "free", // Please register to receive a production apiKey: https://app.budgetinvoice.com/register
        mode: "development", // Production or development, defaults to production   
        images: {
            // The logo on top of your invoice
            logo: "https://public.budgetinvoice.com/img/logo_en_original.png",
            // The invoice background
            background: "https://public.budgetinvoice.com/img/watermark-draft.jpg"
        },
        // Your own data
        sender: {
            company: "Sample Corp",
            address: "Sample Street 123",
            zip: "1234 AB",
            city: "Sampletown",
            country: "Samplecountry"
            // custom1: "custom value 1",
            // custom2: "custom value 2",
            // custom3: "custom value 3"
        },
        // Your recipient
        client: {
            company: order ? order[0].addressDetail[0].name:'nodata',
            address: order[0].productDetails[0].name ,
            zip:order ? order[0].addressDetail[0].pincode:'nodata',
            city:order ? order[0].addressDetail[0].city:'nodata' ,
            country: order ? order[0].addressDetail[0].country:'nodata'
            // custom1: "custom value 1",
            // custom2: "custom value 2",
            // custom3: "custom value 3"
        },
        information: {
            // Invoice number
            number: "2021.0001",
            // Invoice data
            date: "12-12-2021",
            // Invoice due date
            dueDate: "31-12-2021"
        },
        // The products you would like to see on your invoice
        // Total values are being calculated automatically
        products:order[0].products.map((product)=>({
            quantity: product.qty,
            description:order[0].productDetails[0].name,
            taxRate: 0,
            price: order[0].productDetails[0].salesprice
          }),)  ,
        // The message you would like to display on the bottom of your invoice
        bottomNotice: "Kindly pay your invoice within 15 days.",
        // Settings to customize your invoice
        settings: {
            currency: "INR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
            // locale: "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')        
            // marginTop: 25, // Defaults to '25'
            // marginRight: 25, // Defaults to '25'
            // marginLeft: 25, // Defaults to '25'
            // marginBottom: 25, // Defaults to '25'
            // format: "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
            // height: "1000px", // allowed units: mm, cm, in, px
            // width: "500px", // allowed units: mm, cm, in, px
            // orientation: "landscape" // portrait or landscape, defaults to portrait
        },
        // Translate your invoice to your preferred language
        translate: {
            // invoice: "FACTUUR",  // Default to 'INVOICE'
            // number: "Nummer", // Defaults to 'Number'
            // date: "Datum", // Default to 'Date'
            // dueDate: "Verloopdatum", // Defaults to 'Due Date'
            // subtotal: "Subtotaal", // Defaults to 'Subtotal'
            // products: "Producten", // Defaults to 'Products'
            // quantity: "Aantal", // Default to 'Quantity'
            // price: "Prijs", // Defaults to 'Price'
            // productTotal: "Totaal", // Defaults to 'Total'
            // total: "Totaal", // Defaults to 'Total'
            // taxNotation: "btw" // Defaults to 'vat'
        },
    
    }
    console.log(data)
    //Create your invoice! Easy!
  return   easyinvoice.createInvoice(data);
   
}

module.exports={generateInvoice}