const router = require("express").Router();
const con = require('../config/con');
const { registerValidation, loginValidation} = require('../validation/authValidation');
const md5 = require('md5');

router.get("/get-access-user/:access", (req, res) => {
    console.log(req.params)
    const sql = `SELECT username FROM user WHERE salt='${req.params.access}'`
    con.query(sql, (err, result) => {
        if(err){
            console.log(err)
            return res.status(500).send(err)
        }
        if(result){
            console.log(result)
            return res.status(200).send(result)
        }
    })
})

router.post("/auth-sign-in", (req, res) => {
    console.log(req.body)
    //validate request
    const { error } = loginValidation(req.body)
    //sending error message
    if(error){
        console.log(error.details[0].message)
        return res.send({error : error.details[0].message})         
    } 
    //destructuring body request
    const { username, password } = req.body
    //hash password with md5
    const hash_password = md5(password)
    //select with sql database where username and password condition        
    const sql = `SELECT id, fname, lname, username FROM user WHERE username='${username}' AND password='${hash_password}'`
    con.query(sql, (err, result) => {
        //sending server error
        if(err) return res.status(500).send(err)
        //sending response with params
        if(result){            
            console.log(result)  
            return res.status(200).send({user : result, access : md5(username)})          
        }
    })        
})

router.post("/register", (req, res) => {
    //show data log
    console.log(req.body) 
    const {firstname, lastname, username, password, repassword} = req.body    
    //register validations
    const { error } = registerValidation(req.body)

    //return validation error message
    if(error){
        console.log(error.details[0].message)
        return res.send({error : error.details[0].message})         
    } 
    //return validation error password not match message
    if(req.body.password !== req.body.repassword){
        console.log("Password not match")
        return res.send({error : '"พาสเวิร์ดไม่ตรงกัน"'})
    }

    //hash password with md5
    const hash_password = md5(password)
    
    //regis to database
    const sql = `SELECT * FROM user`
    con.query(sql, (err, result) => {
        console.log(result)

        //check username in database return username is alreay
        for(var i in result){            
            if(result[i].username == username){                
                return res.status(200).send({error : "username นี้ถูกใช้งานแล้ว"})
            }
        }
        //insert request to database
        const sql_regis = `INSERT INTO user (fname, lname, username, password, salt) VALUES ("${firstname}", "${lastname}", "${username}", "${hash_password}", "${md5(username)}")`
        con.query(sql_regis, (err, result) => {
            console.log(result)
            if(err) return res.status(500).send(err)            
            if(result) return res.status(200).send({regis : true})
        })
    })    
})

module.exports = router

