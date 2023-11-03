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
      lastname : Joi.string().allow(''),
      password: Joi.string()
        .required()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*[A-Z]).{10,18}$/).required(),
      email: Joi.string().email(),
      status: Joi.any().valid(null),
      environment: Joi.any().valid(null),
      username: Joi.string().required(),
      updated_by: Joi.any().valid(null),
      contact: Joi.string()
        .min(10)
        .max(13)
        .pattern(/^[0-9]+$/)
        ,
      
      status: Joi.any().valid(null),
   

})


const editClientValidateSchema = Joi.object({
    
    _id : Joi.string().required(),   
    firstname : Joi.string().required(),
    lastname : Joi.string(),
    email: Joi.string().email(),
    username: Joi.string().required(),
    contact: Joi.string()
      .min(10)
      .max(13)
      .pattern(/^[0-9]+$/)
      ,
    currency: Joi.string()

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
    status: Joi.any().valid(null),
});

// const addAccountTechnicalSchema = Joi.object({
//     //client_id: Joi.string().required(),
//     account_id: Joi.string().required(),
//     api_username: Joi.string().required(),
//     api_secret: Joi.string().required(),
//     service_endpoint: Joi.string().required(),
//     currency: Joi.string().required(),
//     is_maintenance_mode_on: Joi.string().required(),
//     account_type: Joi.string().required()
    
//   });
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

 
// @author : Injamamul hoque
// created_at : 19.10.2023
// function : searchValidateSchema


const searchValidateSchema = Joi.object({
    
    search : Joi.string().required(),
    type : Joi.string().required()

})

const gameDeleteValidateSchema = Joi.object({
    game_id:Joi.string().required()
});





// @author : Injamamul hoque
// created_at : 26.10.2023
// function : gameListValidateSchema



// @author : Injamamul hoque
// created_at : 26.10.2023
// function : addCategoryValidateSchema

let addCategoryValidateSchema = Joi.object({

    category_name : Joi.object().required()
});

// @author : Injamamul hoque
// created_at : 26.10.2023
// function : editDeleteValidateSchema

let categoryDeleteValidateSchema = Joi.object({
    category_id : Joi.string().required()
})

let categoryEditValidateSchema = Joi.object({

    category_id : Joi.string().required(),
    category_name :Joi.object().required()
});
// @author : Injamamul hoque
// created_at : 26.10.2023
// function : gameListValidateSchema

const gameListValidateSchema = Joi.object({
    provider_id: Joi.string().optional(),
    sub_provider: Joi.string().allow('').optional(),
    game_name: Joi.string().allow('').optional(),
    game_code: Joi.string().allow('').optional(),
    game_id: Joi.string().allow('').optional()
  });

const showCategoryValidateSchema = Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100)
  });


let addClient = async(req,res,next)=>{
    try{
        const value = await addClientValidationSchema.validate(req.body);
        if(value.hasOwnProperty('error')){
            console.log("value",value);
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

let editClientValidate = async (req,res,next) => {
    try {
        const value = await editClientValidateSchema.validate(req.body);
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


// @author : Injamamul hoque
// created_at : 19.10.2023
// function : searchValidateSchema


let searchValidate = async (req, res, next) => {

    try {
       
        const value = await searchValidateSchema.validate(req.body);
        if(value.hasOwnProperty('error')){
            throw new Error(value.error);

        }else{
            next();
        }
        
    } catch (error) {

        let apiResponse = responseLib.generate(true, ` ${error.message}`, null);
        res.status(400);
        res.send(apiResponse)
        
    }

}

const categoryValidate = async(req,res,next)=>{
    try {
        const value = await addCategoryValidateSchema.validate(req.body);
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

const categoryDeleteValidate = async(req,res,next)=>{
    try {
        const value = await categoryDeleteValidateSchema.validate(req.body);
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
const categoryEditValidate =async(req,res,next)=>{
    try {
        console.log("validation ...",req.body)
        const value = await categoryEditValidateSchema.validate(req.body);
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

};

const gameListValidate = async(req,res,next)=>{
     try {
        
        const value = await gameListValidateSchema.validate(req.body);
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

const showCategoryValidate = async(req,res,next)=>{
    try {
        const value = await showCategoryValidateSchema.validate(req.body);
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

const gameDeleteValidate = async(req,res,next) => {
    try {
        const value = await gameDeleteValidateSchema.validate(req.body);
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
    editClientValidate : editClientValidate,
    adminRegisterValidate: adminRegisterValidate,
    addAccountValidation :addAccountValidation,
    addAccountTechnicalValidation :addAccountTechnicalValidation,
    customRegisterValidate: customRegisterValidate,
    createQuestionValidate: createQuestionValidate,
    updateQuestionValidate: updateQuestionValidate,
    codeValidate: codeValidate,
    addLanguageValidate: addLanguageValidate,
    editLanguageValidate: editLanguageValidate,
    deleteLanguageValidate: deleteLanguageValidate,

    addEventValidate: addEventValidate,
    editEventValidate: editEventValidate,
    deleteEventValidate: deleteEventValidate,

    searchValidate: searchValidate,
    categoryValidate: categoryValidate,
    categoryDeleteValidate: categoryDeleteValidate,
    categoryEditValidate:categoryEditValidate,
    gameListValidate:gameListValidate,
    showCategoryValidate:showCategoryValidate,
    gameDeleteValidate:gameDeleteValidate
}