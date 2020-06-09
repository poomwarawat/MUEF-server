const router = require("express").Router();
const con = require("../config/con");

router.get("/get-register", (req, res) => {
  const sql = `SELECT created FROM user`;
  con.query(sql, async (err, result) => {
    if (result.length > 0) {
      const dateArr = [];
      for (i in result) {
        const time = await result[i].created;
        const stringTime = await JSON.stringify(time);
        const splitTime = await stringTime.split("T")[0];
        const splitDouble = await splitTime.split('"')[1];
        //test
        const date = dateArr.find((date) => date[0] === splitDouble);
        if (!date) {
          dateArr.push([splitDouble, 1]);
        } else {
          const dateIndex = dateArr.findIndex(
            (date) => date[0] === splitDouble
          );
          dateArr[dateIndex][1] += 1;
        }
      }
      res.status(200).send(dateArr);
    }
  });
});

module.exports = router;
