const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const con = require("./config/con");
const multer = require("multer");
const upload = multer();
const dotenv = require("dotenv");

dotenv.config();

//app setup
//----app setup
app.use(cors());
app.set("view engine", "pug");
app.enable("trust proxy");
app.use(bodyParser.urlencoded({ extended: true }));

// connection setup
con.connect(function (err) {
  if (err) console.log(err);
  console.log("Connected");
});
//---- for parsing multipart/form-data
app.use(upload.array());
app.use(express.static("public"));

//router config
const authRoute = require("./route/auth");
const muefTestRoute = require("./route/muefTest");
const Question = require("./route/question");
const scoreResult = require("./route/scoreResult");
const adminRoute = require("./route/admin");
const dashBoard = require("./route/dashboard");

app.use("/", authRoute);
app.use("/", muefTestRoute);
app.use("/", Question);
app.use("/", scoreResult);
app.use("/admin", adminRoute);
app.use("/dashboard", dashBoard);

const PORT = process.env.PORT || 4000;

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
