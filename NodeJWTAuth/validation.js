//VALIDATION
const Joi = require("@hapi/joi");

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    })

    //Validate Date  bfore create a= new user
    return schema.validate(data) //req.body

}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    })

    //Validate Date  bfore create a= new user
    return schema.validate(data) //req.body

}

module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;

