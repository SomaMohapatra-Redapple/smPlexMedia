const Joi = require("joi");
const jwt = require("jsonwebtoken");
const apiError = require("../libs/apiError");
const responseMessage = require("../libs/responseMessage");
// const client = require("../services/client");
// const { AddClient, FindAllClient, FindSpecificClient } = client;
const mongoose = require('mongoose');
const ClientTable = mongoose.model('Client');

const AddClient = async (query) => {
  console.log("query", query);
  const client = await ClientTable.create(query);
  console.log("client", client);
  return client;
};
const FindAllClient = async (validatedBody) => {
  const { e_mail, client_name, user_name, contact, page, limit } =
    validatedBody;
  let query = {};
  if (client_name) {
    //query.client_name = new RegExp(client_name,"i");
    query.client_name = client_name;
  }
  if (user_name) {
    query.user_name = user_name;
  }
  if (e_mail) {
    query.e_mail = e_mail;
  }
  if (contact) {
    query.contact = contact;
  }
  let options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 15,
    sort: { createdAt: -1 },
  };
  return await ClientTable.paginate(query, options);
};
const FindSpecificClient = async (query) => {
  const client = await ClientTable.findOne(query);
  return client;
};
const UpdateClientBalance = async (query, options) => {
  const balance = await ClientTable.update(query, options);
  console.log("balance", balance);
  return balance;
};

//add client by super admin
let add_client = async (req, res, next) => {
  try {
    console.log("req.body.value", req.body);
    req.body.created_by = req.user.id;
    const query = req.body;
    const added_client = await AddClient(query)
      .then((result) => {
        res.status(200).send({
          message: "client created",
          result: result,
        });
      })
      .catch((err) => {
        res.status(400).send({
          err: err.message,
        });
      });
    console.log("added_client.error", added_client);
  } catch (e) {
    console.log("error", e);
    return next(e);
  }
};

//add client by client
const add_client_by_client = async(req,res,next) =>{
  try{
    req.body.created_by = req.user.id;
    const query = req.body;
    const added_client = await AddClient(query)
      .then((result) => {
        res.status(200).send({
          message: "client created",
          result: result,
        });
      })
      .catch((err) => {
        res.status(400).send({
          err: err.message,
        });
      });
    console.log("added_client.error", added_client);

  }
  catch(e){
    console.log("error",e);
  }
}

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
        .pattern(/^[0-9]+$/),
      page: Joi.string(),
      limit: Joi.string(),
    });
    const client = {
      e_mail: req.body.e_mail,
      client_name: req.body.name,
      user_name: req.body.user_name,
      contact: req.body.contact,
      page: req.body.page,
      limit: req.body.limit,
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

let log_in = async (req, res, next) => {
  try {
    const { user_name, password } = req.body;
    console.log("user_name", user_name);
    console.log("password", password);
    const query = {
      user_name: user_name,
    };
    const client = await FindSpecificClient(query);
    console.log("client", client);
    if (client.user_name == user_name && client.password == password) {
      token = jwt.sign(
        { id: client.id, email: client.user_name },
        process.env.ENC_KEY,
        { expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME }
      );
      res.status(200).send({
        message: "you are logged in",
        token: token,
      });
    } else {
      res.status(400).send({
        message: "error in log in",
      });
    }
  } catch (e) {
    console.log("error", e);
  }
};

module.exports = {
  add_client: add_client,
  all_client: all_client,
  log_in: log_in,
  add_client_by_client :add_client_by_client
};
