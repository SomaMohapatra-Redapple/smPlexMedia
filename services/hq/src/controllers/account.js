const Joi = require("joi");
const apiError = require("../libs/apiError");
const responseMessage = require("../libs/responseMessage");
// const account = require("../services/account");
// const { AddAccount, ShowAccount } = account;
const mongoose = require('mongoose');
const AccountTable = mongoose.model('Accounts');



const AddAccount = async (query) => {
  return await AccountTable.create(query);
};
const ShowAccount = async (validatedBody) => {
  console.log("validated body",validatedBody);
  
  const { client_id, username, page, limit } =
    validatedBody;
  let query = {};
  if (client_id) {
    //query.client_id = new RegExp(client_id,"i");
    query.client_id = client_id;
  }
  if (username) {
    query.username = username;
  }
  let options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 15,
    sort: { createdAt: -1 },
  };
  return await AccountTable.paginate(query, options);
};
// const ShowAccount = async (query) => {
//   //const {page,limit} = validatedBody;
//   return await AccountTable.find(query);
// };
//add account
const add_account = async (req, res, next) => {
  try {
    const query = req.body;
    const added_account = await AddAccount(query)
      .then((result) => {
        res.status(200).send({
          message: "account created",
          result: result,
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

//show account
const show_account = async (req, res, next) => {
  try {
    const query = {}; //validatedBody.value;
    const added_client = await ShowAccount(query)
      .then((result) => {
        res.status(200).send({
          message: "accounts found",
          result: result,
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

module.exports = {
  add_account: add_account,
  show_account: show_account,
};
