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
  console.log("validated body",validatedBody);
  
  const { e_mail, client_name, parent_client_id, contact, page, limit } =
    validatedBody;
  let query = {};
  if (client_name) {
    //query.client_name = new RegExp(client_name,"i");
    query.client_name = client_name;
  }
  if (parent_client_id) {
    query.parent_client_id = parent_client_id;
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
    console.log("req.headers.token", req.headers.token);
    console.log("req.body.value", req.body);
    req.body.created_by = req.user.id;
    const query = req.body;
    const requester = req.connection.remoteAddress.slice(0,9);
    const added_client = await AddClient(query)
      .then((result) => {
        res.status(200).send({
          message: "client created",
          result: result,
          requester : requester
        });
      })
      .catch((err) => {
        res.status(400).send({
          err: err.message,
        });
      });
    
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

    
      //const query = {};
      console.log("req.body",req.body);
      //console.log("validatedBody.value",validatedBody.value);
      const all_client = await FindAllClient(req.body)
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
