const router = require("express").Router();
const con = require("../config/con");
const jwt = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation,
} = require("../validation/authValidation");
const md5 = require("md5");

router.get("/test", (req, res) => {
  return res.send("Hello world!!!");
});

router.get("/get-access-user/:access", (req, res) => {
  console.log(req.params);
  const sql = `SELECT username FROM user WHERE salt='${req.params.access}'`;
  con.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    if (result) {
      console.log(result);
      return res.status(200).send(result);
    }
  });
});

router.post("/auth-sign-in", (req, res) => {
  console.log(req.body);
  //validate request
  const { error } = loginValidation(req.body);
  //sending error message
  if (error) {
    console.log(error.details[0].message);
    return res.send({ error: error.details[0].message });
  }
  //destructuring body request
  const { username, password } = req.body;
  //hash password with md5
  const hash_password = md5(password);
  console.log(hash_password);
  //select with sql database where username and password condition
  const sql = `SELECT id, fname, lname, username, status FROM user WHERE username='${username}' AND password='${hash_password}'`;
  con.query(sql, (err, result) => {
    //sending server error
    if (err) return res.status(500).send(err);
    //sending response with params
    if (result.length > 0) {
      console.log(result[0]);
      if (result[0].status === "admin") {
        res.status(200).send({
          user: result,
          status: "admin",
          access: md5(result[0].username),
        });
      }
      if (result[0].status === "user") {
        res
          .status(200)
          .send({
            user: result,
            status: "user",
            access: md5(result[0].username),
          });
      }
    } else {
      res.send({ error: "กรุณาตรวจสอบชื่อผู้ใช้งานหรือรหัสผ่าน" });
    }
  });
});

router.post("/register", (req, res) => {
  //show data log
  console.log(req.body);
  const { firstname, lastname, username, password, repassword } = req.body;
  //register validations
  const { error } = registerValidation(req.body);

  //return validation error message
  if (error) {
    console.log(error.details[0].message);
    return res.send({ error: error.details[0].message });
  }
  //return validation error password not match message
  if (req.body.password !== req.body.repassword) {
    console.log("Password not match");
    return res.send({ error: '"พาสเวิร์ดไม่ตรงกัน"' });
  }

  //hash password with md5
  const hash_password = md5(password);

  //regis to database
  const sql = `SELECT * FROM user`;
  con.query(sql, (err, result) => {
    console.log(result);

    //check username in database return username is alreay
    for (var i in result) {
      if (result[i].username == username) {
        return res.status(200).send({ error: "username นี้ถูกใช้งานแล้ว" });
      }
    }
    //insert request to database
    const sql_regis = `INSERT INTO user (fname, lname, username, password, salt, status) VALUES ("${firstname}", "${lastname}", "${username}", "${hash_password}", "${md5(
      username
    )}", "user")`;
    con.query(sql_regis, (err, result) => {
      console.log(result);
      if (err) return res.status(500).send(err);
      if (result) return res.status(200).send({ regis: true });
    });
  });
});

router.get("/start-page", (req, res) => {
  res.json({
    message: "Welcome to page",
  });
});

router.post("/post-page", verifytoken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) res.sendStatus(403);
    else {
      res.json({
        message: "Post created...",
        authData,
      });
    }
  });
});

router.post("/login-page", (req, res) => {
  const user = {
    id: 1,
    username: "poom",
    email: "warawat555@gmail.com ",
  };
  jwt.sign({ user: user }, "secretkey", { expiresIn: "30s" }, (err, token) => {
    res.json({
      token,
    });
  });
});

router.get("test-login-page", (req, res) => {
  console.log("Warawat lailerd");
});

function verifytoken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = router;
