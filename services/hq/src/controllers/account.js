const timeLIb = require("../libs/timeLib");
const responseMessage = require("../libs/responseMessage");
// const account = require("../services/account");
// const { AddAccount, ShowAccount } = account;
const mongoose = require('mongoose');
const AccountTable = mongoose.model('Accounts');



const AddAccount = async (query) => {
  return await AccountTable.create(query);
};
const AddAccountTechnicals = async (query) => {
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
    query.created_at = timeLIb.now();
    query.updated_at = timeLIb.now();
    const added_account = await AddAccount(query)
     
        res.status(200).send({
          message: "account created",
          result: result,
        });
      {
        res.status(400).send({
          err: err.message,
        });
     
      const added_account_technicals = await AddAccountTechnicals(query);
     
        res.status(200).send({
          message: "account created",
          result: result,
        });
     
      {
          res.status(400).send({
            err: err.message,
          });
      }
  }
  }
  catch(e) {
    console.log("error", e);
    return next(e);
  }
}

const add_account_techicals = async (req, res, next) => {
  try {
    const query = req.body;
    query.created_at = timeLIb.now();
    query.updated_at = timeLIb.now();
    const added_account = await AddAccountTechnicals(query)
      .then((result) => {
        res.status(200).send({
          
          result: result,
          message: "account created",
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
  add_account_techicals : add_account_techicals,
}
