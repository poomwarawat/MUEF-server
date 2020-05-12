const router = require("express").Router();
const con = require('../config/con');

router.get("/get-user", (req, res) => {
    console.log("Get user")
    const sql = 'SELECT * FROM user'
    con.query(sql, (err ,result) => {
        if(err) throw err
        if(result){
            console.log(result)
            return res.status(200).send(result)
        }
    })    
})

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
    //   for(var i in result){
    //       console.log(result[i].length)
    //   }
      if(result.length > 0){
          res.send(result);
      }else{
          res.send({not : true})
      }      
    });
  });

module.exports = router

