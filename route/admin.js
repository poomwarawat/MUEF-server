const router = require("express").Router();
const con = require("../config/con");
const md5 = require("md5");
const moment = require("moment");

const tScore2 = [60, 55, 50, 45, 40];
const tScore = [40, 45, 50, 55, 60];

const resultText = [
  [
    "ควรปรับปรุง",
    "ต่ำกว่าเกณฑ์เฉลี่ยมาก (ควรปรับปรุง)",
    "เด็กจำเป็นต้องได้รับการส่งเสริมพัฒนาการคิดเชิงบริหารอย่างเร่งด่วน ครูและพ่อแม่ควรเอาใจใส่ในการส่งเสริมพัฒนาการด้านการคิดเชิงบริหารของเด็กอย่างจริงจังและสม่ำเสมอเพื่อให้เด็กมีพัฒนาการด้าน EF ตามเกณฑ์ของเด็กวัยเดียวกัน",
  ],
  [
    "ควรพัฒนา",
    "ต่ำกว่าเกณฑ์เฉลี่ยเล็กน้อย (ควรพัฒนา)",
    "เด็กควรได้รับการพัฒนาการคิดเชิงบริหารในด้านนั้นๆให้ดียิ่งขึ้น ครูและพ่อแม่ควรเอาใจใส่ในการส่งเสริมพัฒนาการด้าน EF ของเด็กอย่างต่อเนื่องเพื่อให้เด็กมีพัฒนาการด้าน EF ตามวัย",
  ],
  ["ดี", "สูงกว่าเกณฑ์เฉลี่ย (ดี)", "ควรส่งเสริมและรักษาพฤติกรรมนี้ให้คงไว้"],
  [
    "ปานกลาง",
    "อยู่ในเกณฑ์เฉลี่ย (ปานกลาง)",
    "ควรรักษาพฤติกรรมนี้ให้คงไว้ และยังมีโอกาสส่งเสริมให้ดีขึ้นได้อีก",
  ],
  [
    "ดีมาก",
    "สูงกว่าเกณฑ์เฉลี่ยมาก (ดีมาก)",
    "ควรส่งเสริมและรักษาพฤติกรรมนี้ให้คงไว้",
  ],
];
//INH SCORE RULE
const M_INH = [
  [[0, 0, 29, 29, 30, 34]],
  [[0, 0, 24, 25, 25, 28]],
  [[0, 0, 20, 22, 21, 23]],
  [[0, 0, 17, 19, 18, 19]],
  [[0, 0, 13, 15, 14, 15]],
];
const F_INH = [
  [[0, 0, 29, 33, 35, 37]],
  [[0, 0, 25, 29, 29, 33]],
  [[0, 0, 21, 25, 24, 28]],
  [[0, 0, 17, 21, 20, 21]],
  [[0, 0, 14, 17, 15, 17]],
];
//SHF SCORE RULE
const M_SHF = [
  [[0, 0, 15, 15, 16, 18]],
  [[0, 0, 13, 14, 14, 16]],
  [[0, 0, 11, 12, 12, 14]],
  [[0, 0, 10, 10, 10, 11]],
  [[0, 0, 8, 8, 8, 9]],
];
const F_SHF = [
  [[0, 0, 15, 17, 18, 19]],
  [[0, 0, 13, 15, 15, 17]],
  [[0, 0, 11, 13, 13, 15]],
  [[0, 0, 10, 11, 11, 13]],
  [[0, 0, 8, 10, 9, 9]],
];

//EC SCORE RULE
const F_EC = [
  [[0, 0, 14, 16, 16, 18]],
  [[0, 0, 12, 14, 14, 16]],
  [[0, 0, 10, 12, 12, 14]],
  [[0, 0, 9, 10, 10, 11]],
  [[0, 0, 7, 8, 8, 8]],
];
const M_EC = [
  [[0, 0, 14, 15, 15, 17]],
  [[0, 0, 12, 13, 13, 14]],
  [[0, 0, 10, 11, 11, 12]],
  [[0, 0, 9, 9, 10, 10]],
  [[0, 0, 7, 7, 7, 8]],
];

//WM SCORE RULE
const M_WM = [
  [[0, 0, 17, 18, 18, 21]],
  [[0, 0, 15, 16, 16, 18]],
  [[0, 0, 12, 13, 14, 15]],
  [[0, 0, 11, 12, 12, 12]],
  [[0, 0, 9, 9, 9, 10]],
];
const F_WM = [
  [[0, 0, 17, 20, 21, 23]],
  [[0, 0, 15, 18, 18, 20]],
  [[0, 0, 13, 16, 15, 17]],
  [[0, 0, 11, 13, 13, 14]],
  [[0, 0, 9, 11, 10, 11]],
];

//PO SCORE RULE
const M_PO = [
  [[0, 0, 18, 18, 19, 21]],
  [[0, 0, 16, 17, 17, 19]],
  [[0, 0, 13, 14, 16, 16]],
  [[0, 0, 12, 12, 12, 14]],
  [[0, 0, 10, 10, 10, 12]],
];
const F_PO = [
  [[0, 0, 18, 20, 21, 23]],
  [[0, 0, 16, 18, 18, 21]],
  [[0, 0, 13, 16, 16, 18]],
  [[0, 0, 11, 14, 14, 15]],
  [[0, 0, 9, 12, 10, 12]],
];
const F_ISCI = [
  [[0, 0, 44, 50, 51, 55]],
  [[0, 0, 37, 44, 44, 21]],
  [[0, 0, 32, 37, 36, 18]],
  [[0, 0, 27, 31, 30, 15]],
  [[0, 0, 21, 26, 24, 12]],
];
const M_ISCI = [
  [[0, 0, 44, 44, 45, 50]],
  [[0, 0, 36, 38, 37, 43]],
  [[0, 0, 30, 32, 33, 34]],
  [[0, 0, 26, 28, 28, 29]],
  [[0, 0, 20, 22, 22, 23]],
];
const F_FI = [
  [[0, 0, 29, 34, 34, 37]],
  [[0, 0, 25, 30, 30, 33]],
  [[0, 0, 21, 26, 26, 29]],
  [[0, 0, 18, 21, 21, 23]],
  [[0, 0, 15, 17, 17, 18]],
];
const M_FI = [
  [[0, 0, 29, 30, 31, 34]],
  [[0, 0, 25, 26, 27, 30]],
  [[0, 0, 22, 23, 24, 25]],
  [[0, 0, 18, 20, 20, 21]],
  [[0, 0, 15, 15, 15, 17]],
];
const F_EMI = [
  [[0, 0, 36, 40, 43, 45]],
  [[0, 0, 32, 36, 37, 31]],
  [[0, 0, 26, 32, 32, 36]],
  [[0, 0, 22, 28, 26, 29]],
  [[0, 0, 17, 22, 21, 22]],
];
const M_EMI = [
  [[0, 0, 35, 37, 38, 43]],
  [[0, 0, 30, 32, 34, 37]],
  [[0, 0, 26, 28, 29, 31]],
  [[0, 0, 23, 24, 24, 26]],
  [[0, 0, 20, 19, 19, 22]],
];
const F_GEC = [
  [[0, 0, 95, 106, 111, 118]],
  [[0, 0, 80, 95, 96, 107]],
  [[0, 0, 68, 83, 81, 92]],
  [[0, 0, 61, 70, 66, 72]],
  [[0, 0, 45, 59, 53, 57]],
];
const M_GEC = [
  [[0, 0, 92, 96, 97, 109]],
  [[0, 0, 79, 85, 86, 95]],
  [[0, 0, 68, 71, 73, 79]],
  [[0, 0, 58, 63, 62, 65]],
  [[0, 0, 49, 50, 50, 55]],
];

const ALL_TEST = [
  [M_INH, F_INH],
  [M_SHF, F_SHF],
  [M_EC, F_EC],
  [M_WM, F_WM],
  [M_PO, F_PO],
  [M_ISCI, F_ISCI],
  [M_FI, F_FI],
  [M_EMI, F_EMI],
  [M_GEC, F_GEC],
];

router.get("/report", (req, res) => {
  const sql =
    "SELECT * from test_result inner join allstudent on test_result.codeid = allstudent.codeid";
  con.query(sql, (err, results) => {
    if (err) throw err;
    if (results) {
      // console.log(result);
      for (let i in results) {
        const { INH, SHF, EC, WM, PO, gender } = results[i];
        let { birthday, create_time } = results[i];
        let dateDiff = DateDiff(birthday, create_time);
        dateDiff = parseInt(dateDiff);

        const ISCI = parseInt(INH) + parseInt(EC);
        const FI = parseInt(SHF) + parseInt(EC);
        const EMI = parseInt(WM) + parseInt(PO);

        const GEC =
          parseInt(INH) +
          parseInt(SHF) +
          parseInt(EC) +
          parseInt(WM) +
          parseInt(PO);

        let T_SCORE_INH = 0;
        let T_SCORE_SHF = 0;
        let T_SCORE_EC = 0;
        let T_SCORE_WM = 0;
        let T_SCORE_PO = 0;

        let T_SCORE_ISCI = 0;
        let T_SCORE_FI = 0;
        let T_SCORE_EMI = 0;

        let T_SCORE_GEC = 0;

        switch (gender) {
          case "male":
            T_SCORE_INH = tScoreCalculator(
              dateDiff,
              INH,
              ALL_TEST[0][0],
              "INH"
            );
            T_SCORE_SHF = tScoreCalculator(
              dateDiff,
              SHF,
              ALL_TEST[1][0],
              "SHF"
            );
            T_SCORE_EC = tScoreCalculator(dateDiff, EC, ALL_TEST[2][0], "EC");
            T_SCORE_WM = tScoreCalculator(dateDiff, WM, ALL_TEST[3][0], "WM");
            T_SCORE_PO = tScoreCalculator(dateDiff, PO, ALL_TEST[4][0], "PO");
            T_SCORE_ISCI = tScoreCalculator(
              dateDiff,
              ISCI,
              ALL_TEST[5][0],
              "ISCI"
            );
            T_SCORE_FI = tScoreCalculator(dateDiff, FI, ALL_TEST[6][0], "FI");
            T_SCORE_EMI = tScoreCalculator(
              dateDiff,
              EMI,
              ALL_TEST[7][0],
              "EMI"
            );
            T_SCORE_GEC = tScoreCalculator(
              dateDiff,
              GEC,
              ALL_TEST[8][0],
              "GEC"
            );
            break;
          case "female":
            console.log("female");
          default:
            break;
        }
        const allScore = {
          T_SCORE_INH,
          T_SCORE_SHF,
          T_SCORE_EC,
          T_SCORE_WM,
          T_SCORE_PO,
          T_SCORE_ISCI,
          T_SCORE_FI,
          T_SCORE_EMI,
          T_SCORE_GEC,
        };
        const send = {
          allScore: allScore,
          data: results[i],
        };
        res.send(send);
      }
      // res.send(results);
    }
  });
});

function DateDiff(date1, date2) {
  const birthDay = new Date(date1);
  const currentDate = new Date(date2);
  const birthDay_month = parseInt(birthDay.getMonth() + 1);
  const currentDate_month = parseInt(currentDate.getMonth() + 1);
  let dateDiff = Math.abs(birthDay.getFullYear() - currentDate.getFullYear());
  if (birthDay_month > currentDate_month) {
    dateDiff = dateDiff - 1;
  }
  return dateDiff;
}

function tScoreCalculator(age, score, arrData, name) {
  const scoreRule = [];
  var tScoreIndex = 0;
  const data = arrData;
  console.log(score);

  for (let index = data.length - 1; index >= 0; index--) {
    const row = data[index][0];
    const rowIndex = row[age];
    scoreRule.push(rowIndex);
  }
  for (let index = 0; index < scoreRule.length; index++) {
    if (score < scoreRule[0]) {
      // console.log(score + " น้อยกว่า " + scoreRule[0])
      tScoreIndex = index;
      break;
    } else if (score >= scoreRule[index] && score < scoreRule[index + 1]) {
      // console.log(score + " อยู่ระหว่าง " + scoreRule[index] + " กับ " + scoreRule[index+1])
      console.log(index);
      tScoreIndex = index;
    } else if (score >= scoreRule[4]) {
      // console.log(score + " มากกว่า " + scoreRule[4])
      tScoreIndex = index;
    }
  }
  const result = {
    resultText: resultText[tScoreIndex],
    score: tScore[tScoreIndex],
  };
  return result;
}

router.get("/get-user", (req, res) => {
  console.log("Get user");
  const sql = "SELECT fname, lname, id , username, created FROM user";
  con.query(sql, (err, result) => {
    if (err) throw err;
    if (result) {
      console.log(result);
      res.header("Content-Type", "application/json; charset=utf-8");
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
      res.header("Content-Type", "application/json; charset=utf-8");
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
      res.header("Content-Type", "application/json; charset=utf-8");
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
      res.header("Content-Type", "application/json; charset=utf-8");
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
      res.header("Content-Type", "application/json; charset=utf-8");
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
      res.header("Content-Type", "application/json; charset=utf-8");
      res.send(result);
    } else {
      res.header("Content-Type", "application/json; charset=utf-8");
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
      res.header("Content-Type", "application/json; charset=utf-8");
      res.send(result);
    } else {
      res.header("Content-Type", "application/json; charset=utf-8");
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
        res.header("Content-Type", "application/json; charset=utf-8");
        res.send({ username: result });
      }
    });
  } catch (e) {
    res.header("Content-Type", "application/json; charset=utf-8");
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
          res.header("Content-Type", "application/json; charset=utf-8");
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
