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

router.post("/send-score", (req, res) => {
    console.log(req.body)
    const { score, mode, codeId } = req.body
    if(mode === "INH"){        
        const sql = `INSERT INTO test_result (codeId, INH) VALUES ('${codeId}',${parseInt(score)})`
        con.query(sql, (err, result) => {
            if(err) throw err
            if(result){
                return res.status(200).send({add : true})
            }
        })
    }
    if(mode === "SHF"){
        const sql = `UPDATE test_result SET SHF=${parseInt(score)} WHERE codeId='${codeId}'`
        con.query(sql, (err, result) => {
            if(err) throw err
            if(result){
                return res.status(200).send({add : true})
            }
        })
    } 
    if(mode === "EC"){
        const sql = `UPDATE test_result SET EC=${parseInt(score)} WHERE codeId='${codeId}'`
        con.query(sql, (err, result) => {
            if(err) throw err
            if(result){
                return res.status(200).send({add : true})
            }
        })
    } 
    if(mode === "WM"){
        const sql = `UPDATE test_result SET WM=${parseInt(score)} WHERE codeId='${codeId}'`
        con.query(sql, (err, result) => {
            if(err) throw err
            if(result){
                return res.status(200).send({add : true})
            }
        })
    }  
    if(mode === "PO"){
        const sql = `UPDATE test_result SET PO=${parseInt(score)} WHERE codeId='${codeId}'`
        con.query(sql, (err, result) => {
            if(err) throw err
            if(result){
                return res.status(200).send({add : true})
            }
        })
    }    
})

router.get("/get-score-state/:id", (req, res) => {
    console.log(req.params.id)
    const data = {
        INH : false,
        SHF : false,
        EC : false,
        WM : false,
        PO : false
    }
    const sql = `SELECT * FROM test_result WHERE codeId='${req.params.id}'`
    con.query(sql, (err, result) => {
        if(err) throw err
        if(result){            
            for(var i in result){
                console.log(result[i].SHF)
                if(result[i].INH === null){
                    data.INH = false
                }
                if(result[i].INH !== null){                    
                    data.INH = true
                }
                if(result[i].SHF !== null){
                    data.SHF = true
                }
                if(result[i].EC !== null){
                    data.EC = true
                }
                if(result[i].WM !== null){
                    data.WM = true
                }
                if(result[i].PO !== null){
                    data.PO = true
                }
            }
        }
        return res.status(200).send(data)
    })
})

router.get('/get-state-result/:id', (req, res) => {    
    console.log(req.params.id)
    const sql = `SELECT * FROM test_result WHERE codeId='${req.params.id}'`
    con.query(sql, (err, result) => {
        for(var i in result){            
            if(result[i].INH !== null && result[i].SHF !== null && result[i].EC !== null && result[i].WM !== null && result[i].PO !== null){
                return res.status(200).send({result : result[i]})
            }
        }
    })
})

router.get('/get-result/:id', (req, res) => {
    const Data = [
        {INH : 0},
        {SHF : 0},
        {EC : 0},
        {WM : 0},
        {PO : 0},
        {total : 0},
        {gender : ""},
        {birthday : null},
        {firstname : ""},
        {lastname : ""},
        {codeId : ""},
        {birthdayDate : null},
        {create : null}
    ]
    const sql = `SELECT allstudent.fname, allstudent.lname, allstudent.create_time, allstudent.codeId, test_result.INH, test_result.SHF, test_result.EC, test_result.WM, test_result.PO, allstudent.gender, allstudent.birthday FROM test_result INNER JOIN allstudent ON test_result.codeId=allstudent.codeId WHERE test_result.codeId='${req.params.id}'`
    con.query(sql, (err, result) => {
        var total = 0        
        if(err) throw err
        if(result){
            for(var i in result){                
                const create = new Date(result[i].create_time)
                console.log(create)
                const birthdayTime = new Date(result[i].birthday)
                const currentTime = new Date()                
                const difAge = currentTime.getTime() - birthdayTime.getTime()
                const age = ageCalculator(difAge)
                const birthdayDate  = `${birthdayTime.getUTCDate() + 1}/${birthdayTime.getUTCMonth() + 1}/${birthdayTime.getUTCFullYear()}`
                const created = `${create.getUTCDate()}/${create.getUTCMonth() + 1}/${create.getUTCFullYear()}` 
                console.log(created)
                Data[0].INH = result[i].INH
                Data[1].SHF = result[i].SHF
                Data[2].EC = result[i].EC
                Data[3].WM = result[i].WM
                Data[4].PO = result[i].PO
                Data[6].gender = result[i].gender
                Data[7].birthday = age
                Data[8].firstname = result[i].fname
                Data[9].lastname = result[i].lname
                Data[10].codeId = result[i].codeId
                Data[11].birthdayDate = birthdayDate
                Data[12].create = created
                total += result[i].INH
                total += result[i].SHF
                total += result[i].EC
                total += result[i].WM 
                total += result[i].PO                
            }
        }
        if(total !== 0){
            const sql_result = `UPDATE test_result SET total=${total} WHERE codeId='${req.params.id}'`
            con.query(sql_result, (err, result) => {
                if(err) throw err
                if(result){
                    Data[5].total = total
                    // console.log(Data)
                    return res.status(200).send({data : Data})
                }
            })
        }
    })
})

router.get("/check-total-score/:id", (req, res) => {    
    const sql = `SELECT total FROM test_result WHERE codeId='${req.params.id}'`
    con.query(sql, (err, result) => {
        if(err) throw err
        if(result){
            for(var i in result){
                if(result[i].total !== null){
                    return res.status(200).send({result : true})
                }
            }
        }
    })
})

function ageCalculator(ageDifMs){
    const ageDate = new Date(ageDifMs);
    const ageYear = Math.abs(ageDate.getUTCFullYear() - 1970)
    const ageMonth = Math.abs(ageDate.getUTCMonth())
    const ageDay = Math.abs(ageDate.getUTCDay()) - 1 
    const fullAge = {
        year : ageYear,
        month : ageMonth,
        day : ageDay
    }
    return fullAge
}

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