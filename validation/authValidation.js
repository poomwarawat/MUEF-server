const joi = require('@hapi/joi');

const registerValidation = data =>{
    const user = joi.object({
        firstname : joi.string(),
        lastname : joi.string(),
        username : joi.string().min(6),
        password : joi.string().min(8),
        repassword : joi.string().min(8)
    })
    return user.validate(data)
}

const loginValidation = data =>{
    const user = joi.object({
        username : joi.string().min(6),
        password : joi.string().min(8)
    })
    return user.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation