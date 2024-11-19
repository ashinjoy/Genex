const mongoose = require("mongoose");
const mongooseConnection = mongoose.connect(
  process.env.mongoString 
);
mongooseConnection
  .then(() => {
    console.log("Mongo DB is connected successfully");
  })
  .catch((err) => {
    console.log(`Mongo connection failed due to ${err}`);
  });
module.exports = mongooseConnection;
