const mysql = require("mysql");
const con = mysql.createConnection({
  host: "sql12.freemysqlhosting.net",
  port: "3306",
  user: "sql12338864",
  password : "vfHVRBiAU3",
  database: "sql12338864",
});

// host: "localhost",
//   port: "8889",
//   user: "poomwarawat1",
//   password : "111111",
//   database: "muef",



module.exports = con;