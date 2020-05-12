const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  port: "8889",
  user: "poomwarawat1",
  password : "111111",
  database: "muef",
});

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



module.exports = con;