const os = require("os");
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

router.get("/get-cpu-usage", (req, res) => {
  var startMeasure = cpuUsage();
  //Set delay for second Measure
  setTimeout(function () {
    //Grab second Measure
    var endMeasure = cpuUsage();

    //Calculate the difference in idle and total time between the measures
    var idleDifference = endMeasure.idle - startMeasure.idle;
    var totalDifference = endMeasure.total - startMeasure.total;

    //Calculate the average percentage CPU usage
    var percentageCPU = 100 - ~~((100 * idleDifference) / totalDifference);
    //Output result to console
    res.send(percentageCPU.toString());
  }, 100);
});

router.get("/get-cpu-speed", (req, res) => {
  let startMeasures = delta();
  setTimeout(() => {
    const endMeasures = delta();
    const percentageCPU = endMeasures.map((end, i) => {
      return (
        ((end.tick - startMeasures[i].tick) /
          (end.idle - startMeasures[i].idle)) *
        100
      ).toFixed(3);
    });
    res.send({ cpu1: percentageCPU[1], cpu2: percentageCPU[3] });
    // reset
    startMeasures = delta();
  }, 1000);
});

function delta() {
  const cpus = os.cpus();

  return cpus.map((cpu) => {
    const times = cpu.times;
    return {
      tick: Object.keys(times)
        .filter((time) => time !== "idle")
        .reduce((tick, time) => {
          tick += times[time];
          return tick;
        }, 0),
      idle: times.idle,
    };
  });
}

// reset
startMeasures = delta();

function cpuUsage() {
  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0,
    totalTick = 0;
  var cpus = os.cpus();

  //Loop through CPU cores
  for (var i = 0, len = cpus.length; i < len; i++) {
    //Select CPU core
    var cpu = cpus[i];

    //Total up the time in the cores tick
    for (type in cpu.times) {
      totalTick += cpu.times[type];
    }

    //Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }
  return { idle: totalIdle / cpus.length, total: totalTick / cpus.length };
}

module.exports = router;
