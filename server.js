const express = require("express");
require("dotenv").config();
const path = require("path");
const session = require("express-session");
const nocache = require("nocache");

const app = express();
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const dbconnection = require("./config/userModelConfig");
const secret = process.env.jwt_secret;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "/public")));
app.use("/assets", express.static(path.join(__dirname, "/assets")));
app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(nocache());

app.use("/admin", adminRoute);

app.use("/", userRoute);

app.use("*", (req, res, next) => {
  res.status(404).render("user/404");
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send("internal server error");
});

app.listen(process.env.PORT, () => {
  console.log("server is started at http://localhost:3000");
});
