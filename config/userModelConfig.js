const mongoose = require("mongoose");
const mongooseConnection = mongoose.connect(process.env.mongoString || process.env.db);
mongooseConnection
  .then(() => {
    console.log("Mongo DB is connected successfully");
  })
  .catch((err) => {
    console.log(`Mongo connection failed due to ${err}`);
  });
module.exports=mongooseConnection