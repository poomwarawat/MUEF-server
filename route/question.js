const router = require("express").Router();
const con = require('../config/con');

router.get("/GET-INH", (req, res) => {
    const sql = `SELECT * FROM INH`
    con.query(sql, (err, result) => {
        if(err) throw err
        if(result){
            console.log(result)
            return res.status(200).send(result)
        }
    })
})

router.get("/GET-SHF", (req, res) => {
    const sql = `SELECT * FROM SHF`
    con.query(sql, (err, result) => {
        if(err) throw err
        if(result){
            console.log(result)
            return res.status(200).send(result)
        }
    })
})

router.get("/GET-EC", (req, res) => {
    const sql = `SELECT * FROM EC`
    con.query(sql, (err, result) => {
        if(err) throw err
        if(result){
            console.log(result)
            return res.status(200).send(result)
        }
    })
})

router.get("/GET-WM", (req, res) => {
    const sql = `SELECT * FROM WM`
    con.query(sql, (err, result) => {
        if(err) throw err
        if(result){
            console.log(result)
            return res.status(200).send(result)
        }
    })
})

router.get("/GET-PO", (req, res) => {
    const sql = `SELECT * FROM PO`
    con.query(sql, (err, result) => {
        if(err) throw err
        if(result){
            console.log(result)
            return res.status(200).send(result)
        }
    })
})

module.exports = router