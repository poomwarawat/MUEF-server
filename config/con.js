const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  port: "8889",
  user: "poomwarawat1",
  password : "111111",
  database: "muef",
});



module.exports = con;