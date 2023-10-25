const responseLib = require('../libs/responseLib');

const Joi = require('joi').extend(require('@joi/date'));


const customLoginValidateSchema = Joi.object({
    
    username: Joi.string()
        .required(),
    password: Joi.string()
        .max(20)
        .required()
        // source_type: Joi.number().required()
});

const showAllClientValidateSchema = Joi.object({
    
    e_mail: Joi.string().email(),
    client_name: Joi.string(),
    role : Joi.string(),
    parent_client_id: Joi.string(),
    user_name: Joi.string(),
    contact: Joi.string()
      .min(10)
      .max(13)
      .pattern(/^[0-9]+$/),
    page: Joi.number(),
    limit: Joi.number(),
  });

const addClientValidationSchema = Joi.object({
    
        
      firstname : Joi.string().required(),
      lastname : Joi.string(),
      password: Joi.string()
        .required()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*[A-Z]).{10,18}$/).required(),
      email: Joi.string().email(),
      status: Joi.string(),
      environment: Joi.string(),
      username: Joi.string().required(),
      updated_by: Joi.string(),
      contact: Joi.string()
        .min(10)
        .max(13)
        .pattern(/^[0-9]+$/)
        ,
      environment: Joi.string(),
      status: Joi.string(),
   

})

const addAdminValidationSchema = Joi.object({
    
    //client_id: Joi.string().required(),
  parent_client_id: Joi.string().required(),
  password: Joi.string()
    .required()
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*[A-Z]).{10,18}$/),
  email: Joi.string().email().required(),
  status: Joi.string().required(),
  environment: Joi.string().required(),
  client_name: Joi.string().required(),
  username: Joi.string().required(),
  updated_by: Joi.string().required(),
  contact: Joi.string()
    .min(10)
    .max(13)
    .pattern(/^[0-9]+$/)
    .required(),
  environment: Joi.string().required(),
  status: Joi.string().required(),
  role : Joi.string().required()

})

const addAccountSchema = Joi.object({
    client_id: Joi.string().required(),
    account_name: Joi.string().required(),
    account_type:Joi.string().required(),
    environment : Joi.string().required(),
    currency:Joi.string().required(),
    status: Joi.string().required(),
});

const addAccountTechnicalSchema = Joi.object({
    //client_id: Joi.string().required(),
    client_id: Joi.string().required(),
    account_id: Joi.string(),
    api_username: Joi.string(),
    api_secret: Joi.string(),
    service_endpoint: Joi.string(),
    currency: Joi.string(),
    is_maintenance_mode_on: Joi.string(),
    account_type: Joi.string(),
    
  });
const LoginValidateSchema = Joi.object({
    username: Joi.string()
        .required(),
    password: Joi.string()
        .max(20)
        .required()
        // source_type: Joi.number().required()
});

const AdminLoginValidateSchema = Joi.object({
    username: Joi.string()
        .required(),
    password: Joi.string()
        .max(20)
        .required(),
    // role: Joi.string()
    //     .required(),
        // source_type: Joi.number().required()
});

const adminRegisterValidateSchema = Joi.object({
    admin_name : Joi.string()
    .required(),
    username: Joi.string()
        .required(),
    password: Joi.string()
        .max(20)
        .required(),
    status: Joi.string()
        .required(),
    role: Joi.string()
        .required(),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    contact: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    // source_type: Joi.number().required()
});

const customRegisterValidateSchema = Joi.object({
    event_id: Joi.string()
        .required(),
    username: Joi.string()
        .required(),
    name: Joi.string()
        .required(),
    password: Joi.string()
        .max(20)
        .required(),
    user_type: Joi.number().integer().required().valid(3),
    email: Joi.string().pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required(),
    mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    lang: Joi.string().required(),
    genre: Joi.string().required(),
    exp: Joi.number().required()
});

let option = Joi.object().keys({
    opt: Joi.string().required(),
    marks: Joi.number().required()
}).required();

let example = Joi.object().keys({
    input: Joi.string().required(),
    output: Joi.string().required()
}).required();

let mcq = Joi.object().keys({
    question_id: Joi.string().required().allow(''),
    question: Joi.string().required(),
    options: Joi.array().items(option).required()
});

let sub = Joi.object().keys({
    question_id: Joi.string().required().allow(''),
    question: Joi.string().required(),
    examples: Joi.array().items(example).required(),
    runtime_func: Joi.string().required().allow(''),
    constraints: Joi.array()
});


const createQuestionValidateSchema = Joi.object({
    lang: Joi.string().required(),
    exp: Joi.number().required(),
    objectives: Joi.array().items(mcq).required(),
    subjectives: Joi.array().items(sub).required()
});

const updateQuestionValidateSchema = Joi.object({
    set_id: Joi.string().required(),
    lang: Joi.string().required(),
    exp: Joi.number().required(),
    objectives: Joi.array().items(mcq).required(),
    subjectives: Joi.array().items(sub).required()
});

let answer = Joi.object().keys({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    marks: Joi.number().required()
});
const submitMCQValidateSchema = Joi.object({
    lang: Joi.string().required(),
    exp: Joi.number().required(),
    // question_id: Joi.string().required(),
    mcq_response: Joi.array().items(answer).required()
});

const codeValidateSchema = Joi.object({
    question_id: Joi.string().required(),
    question: Joi.string().required(),
    lang: Joi.string().required(),
    code: Joi.string().required(),
    submit: Joi.boolean().required()
});

const addLanguageValidateSchema = Joi.object({
    name: Joi.string().required(),
    extension: Joi.string().required(),
});

const editLanguageValidateSchema = Joi.object({
    name: Joi.string().allow(''),
    extension: Joi.string().allow(''),
    language_id: Joi.required()
})

const deleteLanguageValidateSchema = Joi.object({
    language_id: Joi.required()
})

const addEventValidateSchema = Joi.object({
    event_name: Joi.string().required(),
    event_logo: Joi.allow(''),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
});

const editEventValidateSchema = Joi.object({
    event_id: Joi.string().required(),
    event_name: Joi.string().required(),
    event_logo: Joi.allow(''),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
});

const deleteEventValidateSchema = Joi.object({
    event_id: Joi.required()
})


let addClient = async(req,res,next)=>{
    try{
        const value = await addClientValidationSchema.validate(req.body);
        if(value.hasOwnProperty('error')){
        throw new Error(value.error);
    }
    else{
        next();
    }

    }
    catch(err){
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)

    }
}

let showAllClient = async(req,res,next)=>{
    try{
        const value = await showAllClientValidateSchema.validate(req.body);
        if(value.hasOwnProperty('error')){
        throw new Error(value.error);
    }
    else{
        next();
    }

    }
    catch(err){
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)

    }
}

let loginValidate = async(req, res, next) => {
    try {
        const value = await LoginValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let AdminLoginValidate = async(req, res, next) => {
    try {
        const value = await AdminLoginValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let adminRegisterValidate = async(req, res, next) => {
    try {
        const value = await adminRegisterValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let addAccountValidation = async(req, res, next) => {
    try {
        const value = await addAccountSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let addAccountTechnicalValidation = async(req, res, next) => {
    try {
        const value = await addAccountTechnicalSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let customRegisterValidate = async(req, res, next) => {
    try {
        const value = await customRegisterValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let createQuestionValidate = async(req, res, next) => {
    try {
        const value = await createQuestionValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, `${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}
let updateQuestionValidate = async(req, res, next) => {
    try {
        const value = await updateQuestionValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, `${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let mcqValidate = async(req, res, next) => {
    try {
        const value = await submitMCQValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let codeValidate = async(req, res, next) => {
    try {
        const value = await codeValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}


let addLanguageValidate = async(req, res, next) => {
    try {
        const value = await addLanguageValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let editLanguageValidate = async(req, res, next) => {
    try {
        const value = await editLanguageValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let deleteLanguageValidate = async(req, res, next) => {
    try {
        const value = await deleteLanguageValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}


let addEventValidate = async(req, res, next) => {
    try {
        const value = await addEventValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

let editEventValidate = async(req, res, next) => {
    try {
        const value = await editEventValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}


let deleteEventValidate = async(req, res, next) => {
    try {
        const value = await deleteEventValidateSchema.validate(req.body);
        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }
    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ${err.message}`, null);
        res.status(400);
        res.send(apiResponse)
    }
}

module.exports = {
    loginValidate: loginValidate,
    AdminLoginValidate :AdminLoginValidate,
    addClient : addClient,
    showAllClient :showAllClient,
    adminRegisterValidate: adminRegisterValidate,
    addAccountValidation :addAccountValidation,
    addAccountTechnicalValidation :addAccountTechnicalValidation,
    customRegisterValidate: customRegisterValidate,
    createQuestionValidate: createQuestionValidate,
    updateQuestionValidate: updateQuestionValidate,
    mcqValidate: mcqValidate,
    codeValidate: codeValidate,
    addLanguageValidate: addLanguageValidate,
    editLanguageValidate: editLanguageValidate,
    deleteLanguageValidate: deleteLanguageValidate,

    addEventValidate: addEventValidate,
    editEventValidate: editEventValidate,
    deleteEventValidate: deleteEventValidate,
}