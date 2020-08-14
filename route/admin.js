const router = require("express").Router();
const con = require("../config/con");
const md5 = require("md5");
const moment = require("moment");

router.get("/get-user", (req, res) => {
  console.log("Get user");
  const sql = "SELECT fname, lname, id , username, created FROM user";
  con.query(sql, (err, result) => {
    if (err) throw err;
    if (result) {
      console.log(result);
      return res.status(200).send(result);
    }
  });
});

router.get("/get-user-data/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT fname, lname, id , username, created FROM user WHERE id=${id}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    if (result) {
      console.log(result);
      return res.status(200).send(result);
    }
  });
});

router.post("/update-profile", (req, res) => {
  const { firstname, lastname, id } = req.body;
  const sql = `UPDATE user SET fname='${firstname}', lname='${lastname}' WHERE id=${id}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    if (result) {
      res.send({ update: true });
    }
  });
});

router.post("/update-password", (req, res) => {
  const { password, id } = req.body;
  const HashPassword = md5(password);
  const sql = `UPDATE user SET password='${HashPassword}' WHERE id=${id}`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    if (result) {
      res.send({ update: true });
    }
  });
});

router.get("/get-student", (req, res) => {
  console.log("Get student");
  const sql = "SELECT * FROM allstudent";
  con.query(sql, (err, result) => {
    if (err) throw err;
    if (result) {
      console.log(result);
      return res.status(200).send(result);
    }
  });
});

router.post("/search-user", (req, res) => {
  let data = req.body.data;
  let sql = `SELECT *
    FROM user
    WHERE username LIKE '${data}__%'
    OR fname LIKE '${data}__%'
    OR lname LIKE '${data}__%'
    OR id LIKE '${data}__%'`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send({ not: true });
    }
  });
});
router.post("/search-student", (req, res) => {
  let data = req.body.data;
  let sql = `SELECT *
    FROM allstudent
    WHERE schoolname LIKE '${data}__%'
    OR fname LIKE '${data}__%'
    OR lname LIKE '${data}__%'`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send({ not: true });
    }
  });
});

router.get("/get-all-username", (req, res) => {
  console.log("Start");
  const sql = "SELECT username from user";
  try {
    con.query(sql, (err, result) => {
      if (err) throw err;
      if (result) {
        console.log(result);
        res.send({ username: result });
      }
    });
  } catch (e) {
    conosle.log(e);
    res.send({ error: e });
  }
});

router.post("/upload-csv-data", (req, res) => {
  var count = 0;
  for (let index = 1; index <= req.body.LengthData; index++) {
    const value = `newstd${index}`;
    const stringValue = value.toString();
    const data = req.body[stringValue];
    const splitData = data.split(",");
    const currentDate = new Date();
    const getDate = currentDate.getDate();
    const getDay = currentDate.getDay();
    const getFullYear = currentDate.getFullYear();
    const getMilli = currentDate.getMilliseconds();
    const getHours = currentDate.getHours();
    const genID = makeid(10);
    const codeID = `${getFullYear}${getDay}${getDate}${getHours}${getMilli}${genID}`;
    const sql = `INSERT INTO allstudent 
    (fname, lname, nname, gender, birthday, salary, stdCode, stdRoom, 
      schoolname, region, district, province, codeId, user) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const splitTime = splitData[5].split("/");
    const newSplittime = `${splitTime[2]}-${splitTime[1]}-${splitTime[0]}`;
    const newDate = new Date(newSplittime);
    const newTime = moment(newDate).format("llll");
    // const newTimeDate = Date.parse(newTimeStamp);
    const Data = [
      splitData[1],
      splitData[2],
      splitData[3],
      splitData[4],
      newTime,
      splitData[6],
      splitData[7],
      splitData[8],
      splitData[9],
      splitData[10],
      splitData[11],
      splitData[12],
      codeID,
      splitData[15],
    ];
    const values = Object.values(Data);
    console.log(values);
    con.query(sql, values, (err, result) => {
      if (err) throw err;
      if (result) {
        count += 1;
        if (count === parseInt(req.body.LengthData)) {
          return res.status(200).send({ add: true });
        }
      }
    });
  }
});

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;
