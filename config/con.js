const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
const con = mysql.createConnection({
  host: "mueftest.cj1zdonzvbje.us-east-2.rds.amazonaws.com",
  port: "3306",
  user: "root",
  password: "poom0925350380",
  database: "muef",
});
// host: "mueftest.cj1zdonzvbje.us-east-2.rds.amazonaws.com",
//   port: "3306",
//   user: "root",
//   password: "poom0925350380",
//   database: "muef",

// host: "localhost",
//   port: "8889",
//   user: "poomwarawat1",
//   password : "111111",
//   database: "muef",

// host: "sql12.freemysqlhosting.net",
//   port: "3306",
//   user: "sql12338864",
//   password : "vfHVRBiAU3",
//   database: "sql12338864",

// host: process.env.RDS_HOSTNAME,
// port: process.env.RDS_PORT,
// user: process.env.RDS_DB_NAME,
// password: process.env.RDS_USERNAME,
// database: process.env.RDS_PASSWORD,

module.exports = con;
