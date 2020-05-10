const router = require("express").Router();
const con = require('../config/con');

// const tScore = [60, 55, 50, 45, 40]
const tScore = [40, 45, 50, 55, 60]


//INH SCORE RULE
const M_INH = [
    [[0, 0, 29, 29, 30, 34]],
    [[0, 0, 24, 25, 25, 28]],
    [[0, 0, 20, 22, 21, 23]],
    [[0, 0, 17, 19, 18, 19]],
    [[0, 0, 13, 15, 14, 15]]
] 
const F_INH = [
    [[0, 0, 29, 33, 35, 37]],
    [[0, 0, 25, 29, 29, 33]],
    [[0, 0, 21, 25, 24, 28]],
    [[0, 0, 17, 21, 20, 21]],
    [[0, 0, 14, 17, 15, 17]]
]
//SHF SCORE RULE
const M_SHF = [
    [[0, 0, 15, 15, 16, 18]],
    [[0, 0, 13, 14, 14, 16]],
    [[0, 0, 11, 12, 12, 14]],
    [[0, 0, 10, 10, 10, 11]],
    [[0, 0, 8, 8, 8, 9]]
]
const F_SHF = [
    [[0, 0, 15, 17, 18, 19]],
    [[0, 0, 13, 15, 15, 17]],
    [[0, 0, 11, 13, 13, 15]],
    [[0, 0, 10, 11, 11, 13]],
    [[0, 0, 8, 10, 9, 9]]
]

//EC SCORE RULE
const F_EC = [
    [[0, 0, 14, 16, 16, 18]],
    [[0, 0, 12, 14, 14, 16]],
    [[0, 0, 10, 12, 12, 14]],
    [[0, 0, 9, 10, 10, 11]],
    [[0, 0, 7, 8, 8, 8]]
] 
const M_EC = [
    [[0, 0, 14, 15, 15, 17]],
    [[0, 0, 12, 13, 13, 14]],
    [[0, 0, 10, 11, 11, 12]],
    [[0, 0, 9, 9, 10, 10]],
    [[0, 0, 7, 7, 7, 8]]
] 

//WM SCORE RULE
const M_WM = [
    [[0, 0, 17, 18, 18, 21]],
    [[0, 0, 15, 16, 16, 18]],
    [[0, 0, 12, 13, 14, 15]],
    [[0, 0, 11, 12, 12, 12]],
    [[0, 0, 9, 9, 9, 10]]
]
const F_WM = [
    [[0, 0, 17, 20, 21, 23]],
    [[0, 0, 15, 18, 18, 20]],
    [[0, 0, 13, 16, 15, 17]],
    [[0, 0, 11, 13, 13, 14]],
    [[0, 0, 9, 11, 10, 11]]
]

//PO SCORE RULE
const M_PO = [
    [[0, 0, 18, 18, 19, 21]],
    [[0, 0, 16, 17, 17, 19]],
    [[0, 0, 13, 14, 16, 16]],
    [[0, 0, 12, 12, 12, 14]],
    [[0, 0, 10, 10, 10, 12]]
]
const F_PO = [
    [[0, 0, 18, 20, 21, 23]],
    [[0, 0, 16, 18, 18, 21]],
    [[0, 0, 13, 16, 16, 18]],
    [[0, 0, 11, 14, 14, 15]],
    [[0, 0, 9, 12, 10, 12]]
]

const ALL_TEST = [ 
    [M_INH, F_INH],
    [M_SHF, F_SHF],
    [M_EC, F_EC],
    [M_WM, F_WM],
    [M_PO, F_PO]
]

router.get("/get-result-score/:INH/:SHF/:EC/:WM/:PO/:gender/:age", (req ,res) => {
    // console.log(req.params)
    const { INH, SHF, EC, WM, PO, gender, age } = req.params 
    
    const AGE = parseInt(age)
    const INH_SCORE = parseInt(INH)
    const SHF_SCORE = parseInt(SHF)
    const EC_SCORE = parseInt(EC)
    const WM_SCORE = parseInt(WM)
    const PO_SCORE = parseInt(PO)  
    
    var T_SCORE_INH = 0
    var T_SCORE_SHF = 0
    var T_SCORE_EC = 0
    var T_SCORE_WM = 0
    var T_SCORE_PO = 0

    console.log("------------------------")
    console.log("DEFEAULT INH SCORE : " + INH_SCORE)

    if(gender === 'male'){
        console.log('male')        
        T_SCORE_INH = tScoreCalculator(AGE, 29, ALL_TEST[0][0] , "INH")
        T_SCORE_SHF = tScoreCalculator(AGE, 13, ALL_TEST[1][0] , "SHF")
        T_SCORE_EC = tScoreCalculator(AGE, 18, ALL_TEST[2][0] , "EC")
        T_SCORE_WM = tScoreCalculator(AGE, 9, ALL_TEST[3][0] , "WM")
        T_SCORE_PO = tScoreCalculator(AGE, 17, ALL_TEST[4][0] , "PO")
        // T_SCORE_INH = tScoreCalculator(AGE, INH_SCORE, ALL_TEST[0][0])
        // T_SCORE_SHF = tScoreCalculator(AGE, SHF_SCORE, ALL_TEST[1][0])
        // T_SCORE_EC = tScoreCalculator(AGE, EC_SCORE, ALL_TEST[2][0])
        // T_SCORE_WM = tScoreCalculator(AGE, WM_SCORE, ALL_TEST[3][0])
        // T_SCORE_PO = tScoreCalculator(AGE, PO_SCORE, ALL_TEST[4][0])
    }else if(gender === 'female'){
        console.log('female')
        T_SCORE_INH = tScoreCalculator(AGE, INH_SCORE, ALL_TEST[0][1], "INH")
        T_SCORE_SHF = tScoreCalculator(AGE, SHF_SCORE, ALL_TEST[1][1], "SHF")
        T_SCORE_EC = tScoreCalculator(AGE, EC_SCORE, ALL_TEST[2][1], "EC")
        T_SCORE_WM = tScoreCalculator(AGE, WM_SCORE, ALL_TEST[3][1], "WM")
        T_SCORE_PO = tScoreCalculator(AGE, PO_SCORE, ALL_TEST[4][1], "PO")
    }
    console.log("---------------------")
    console.log(T_SCORE_INH)
    console.log(T_SCORE_SHF)
    console.log(T_SCORE_EC)
    console.log(T_SCORE_WM)
    console.log(T_SCORE_PO)
    console.log("---------------------")
})




function tScoreCalculator(age, score, arrData, name){      
    const scoreRule = []
    var tScoreIndex = 0
    const data = arrData  
    console.log("---------------------")
    console.log("TEST TYPE : " + name)
    console.log("AGE : " + age)
    console.log(data)
    console.log("---------------------")

    for (let index = data.length - 1; index >= 0; index--) {        
        const row = data[index][0]                
        const rowIndex = row[age]        
        scoreRule.push(rowIndex)               
    }    
    for (let index = 0; index < scoreRule.length; index++) {                              
        if(score < scoreRule[0]){             
            console.log(score + " น้อยกว่า " + scoreRule[0])
            tScoreIndex = index  
            break;                        
        }else if(score >= scoreRule[index] && score < scoreRule[index + 1] ){                                    
            console.log(score + " อยู่ระหว่าง " + scoreRule[index] + " กับ " + scoreRule[index+1])
            console.log(index)
            tScoreIndex = index                
        }else if(score >= scoreRule[4]){                          
            console.log(score + " มากกว่า " + scoreRule[4])
            tScoreIndex = index                       
        }
    }        
    return tScore[tScoreIndex]
}


module.exports = router