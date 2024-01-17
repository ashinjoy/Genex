const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: { user:process.env.mail, pass: process.env.password },
});

async function sendMail(otp,email){
  try{

    const mailoptions={
      from:"ashinjoy666@gmail.com",
      to:email,
      subject:"GEN-Z Clothing signup verification",
      text:`verification otp:${otp}`
    }
  
   const mailtransfered=await transport.sendMail(mailoptions)
   if(mailtransfered){
    console.log("mail transfered successfully")
   }
  
  }
 catch(err){
  console.error(err)
 }

}
module.exports=sendMail




