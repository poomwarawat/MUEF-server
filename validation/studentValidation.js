const joi = require('@hapi/joi');

const studentValidation = data =>{
    const student = joi.object({
        firstname : joi.string(),
        lastname : joi.string(),
        nickname : joi.string(),
        gender : joi.string(),
        birthday : joi.date(),        
        birthdayTime : joi.string().allow(),
        salary : joi.string().allow(),
        stdCode : joi.string(),
        stdRoom : joi.string(),
        schoolname : joi.string(),
        region : joi.string(),
        district : joi.string(),
        province : joi.string(),
        user : joi.string().allow()
    })
    return student.validate(data)
}

module.exports.studentValidation = studentValidation
