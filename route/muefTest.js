const router = require("express").Router();
const con = require('../config/con');
const md5 = require('md5');
const { studentValidation } = require('../validation/studentValidation');

router.post("/insert-student", (req, res) => {
    
    const { error } =  studentValidation(req.body)
    // return error message
    if(error){
        console.log(error.details[0].message)
        return res.send({error : error.details[0].message})         
    } 
    const currentDate = new Date()
    const { firstname, lastname, nickname, gender, birthday, birthdayTime, salary, stdCode, stdRoom, schoolname, region, district, province, user} = req.body    
    const newBirthdayTime = parseInt(birthdayTime) 
    const diff = currentDate - newBirthdayTime    
    if(diff < 63229666569){
        return res.status(200).send({error : "อายุเด็กไม่ถึง 2 ปี"})
    }
    if(diff > 189460195393){
        return res.status(200).send({error : "อายุเด็กมากกว่า 6 ปี"})
    }
    
    const getDate = currentDate.getDate()    
    const getDay = currentDate.getDay()    
    const getFullYear = currentDate.getFullYear()    
    const getMilli = currentDate.getMilliseconds()
    const getHours = currentDate.getHours()    
    const genID = makeid(10)
    const codeID = `${getFullYear}${getDay}${getDate}${getHours}${getMilli}${genID}`
    console.log(codeID)

    const sql = `INSERT INTO allstudent (fname, lname, nname, gender, birthday, salary, stdCode, stdRoom, schoolname, region, district, province, codeId, user) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`     
    const data = [firstname, lastname, nickname, gender, birthday, salary, stdCode, stdRoom, schoolname, region, district, province, codeID, user]
    const values = Object.values(data)
    con.query(sql, values, (err, result) => {
        if(err){
            console.log(err)
            return res.status(500).send(err)
        }        
        if(result){            
            console.log(result)  
            const sql_get = `SELECT * FROM allstudent WHERE codeId='${codeID}'`
            con.query(sql_get, (err1, result1) => {
                if(err){
                    console.log(err)
                    return res.status(500).send(err)
                }       
                if(result1){
                    console.log(result1)
                    return res.status(200).send({insert : true, data : result1})    
                }
            })                    
        }
    }) 
})

router.get("/get-student-user/:user", (req, res) => {
    console.log(req.params.user)
    const sql = `SELECT * FROM allstudent WHERE user='${req.params.user}'`
    con.query(sql, (err, result) => {
        if(err) throw err
        if(result){
            console.log(result)
            return res.status(200).send(result)
        }
    })
})

router.get("/get-student/:id", (req, res) => {
    console.log(req.params.id)
    const sql = `SELECT * FROM allstudent WHERE codeId='${req.params.id}'`
    con.query(sql, (err, result) => {
        if(err) throw err
        if(result){
            console.log(result)
            return res.status(200).send(result)
        }
    })
})

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = router