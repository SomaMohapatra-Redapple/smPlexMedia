const Joi = require("joi");
const apiError = require("../libs/apiError");
const responseMessage = require("../libs/responseMessage");
const client = require("../services/client");
const { AddClient, FindAllClient } = client;

//add client
let add_client = async (req, res, next) => {
  try {
    const schema = Joi.object({
      //client_id: Joi.string().required(),

      password: Joi.string()
        .required()
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*[A-Z]).{10,18}$/),
      e_mail: Joi.string().email().required(),
      status: Joi.string().required(),
      environment: Joi.string().required(),
      client_name: Joi.string().required(),
      user_name: Joi.string().required(),
      created_by: Joi.string().required(),
      updated_by: Joi.string().required(),
      contact: Joi.string()
        .min(10)
        .max(13)
        .pattern(/^[0-9]+$/)
        .required(),
    });
    const client = {
      password: req.body.password,
      e_mail: req.body.e_mail,
      status: req.body.status,
      environment: req.body.environment,
      client_name: req.body.name,
      user_name: req.body.user_name,
      contact: req.body.contact,
      created_by: req.body.created_by,
      updated_by: req.body.updated_by,
    };

    const validatedBody = schema.validate(client);
    if (validatedBody.error) {
      console.log("i am validated body", validatedBody.error);
      res.status(403).send({
        message: validatedBody.error.message,
      });
    } else {
      const query = validatedBody.value;
      const added_client = await AddClient(query)
        .then((result) => {
          res.status(200).send({
            message: "client created",
            result : result
          });
        })
        .catch((err) => {
          res.status(400).send({
            err: err.message,
          });
        });
      console.log("added_client.error", added_client);
    }
  } catch (e) {
    console.log("error", e);
    return next(e);
  }
};

//find all client
let all_client = async (req, res, next) => {
  try {
    const schema = Joi.object({
      e_mail: Joi.string().email(),
      client_name: Joi.string(),
      user_name: Joi.string(),
      contact: Joi.string()
        .min(10)
        .max(13)
        .pattern(/^[0-9]+$/)
        ,
        page: Joi.string(),
        limit: Joi.string(),
    });
    const client = {
      e_mail: req.body.e_mail,
      client_name: req.body.name,
      user_name: req.body.user_name,
      contact: req.body.contact,
      page : req.body.page,
      limit : req.body.limit
    };

    const validatedBody = schema.validate(client);
    if (validatedBody.error) {
      console.log("i am validated body", validatedBody.error);
      res.status(403).send({
        message: validatedBody.error.message,
      });
    } else {
      //const query = {};
      const all_client = await FindAllClient(validatedBody.value)
        .then((result) => {
          res.status(200).send({
            result: result,
            mesage: "all_client list",
          });
        })
        .catch((err) => {
          res.status(404).send({
            err: err.message,
          });
        });
    }
    
  } catch (e) {
    next(e);
  }
};

module.exports = {
  add_client: add_client,
  all_client: all_client,
};
