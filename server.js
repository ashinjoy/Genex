const express = require("express");
require("dotenv").config();
const path=require("path")
const session=require("express-session")
const nocache=require("nocache")

const app = express();
const userRoute = require("./routes/userRoute");
const adminRoute=require("./routes/adminRoute")
const dbconnection = require("./config/userModelConfig");

app.set("view engine", "ejs");
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/public",express.static(path.join(__dirname,"/public")))
app.use("/assets",express.static(path.join(__dirname,"/assets")))
app.use(session({
  secret:process.env.secret,
  resave:false,
  saveUninitialized:false
}))
app.use(nocache())
app.use("/", userRoute)

app.use("/admin",adminRoute)


app.listen(process.env.PORT, () => {
  console.log("server is started at http://localhost:3000");
});
