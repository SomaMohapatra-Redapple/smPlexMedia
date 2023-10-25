const timeLIb = require("../libs/timeLib");
const responseMessage = require("../libs/responseMessage");
// const account = require("../services/account");
// const { AddAccount, ShowAccount } = account;
const mongoose = require("mongoose");
const AccountTable = mongoose.model("Accounts");
const AccountsTechnicalsTable = mongoose.model("AccountsTechnicals");

const AddAccount = async (query) => {
  return await AccountTable.create(query);
};
const AccountUpdate = async (query) => {
  return AccountTable.updateOne(query);
};
const AddAccountTechnicals = async (query) => {
  return await AccountsTechnicalsTable.create(query);
};
const AccountTechnicalsUpdate = async (query) => {
  return AccountsTechnicalsTable.updateOne(query);
};
const ShowAccount = async (validatedBody) => {
  console.log("validated body", validatedBody);

  const { client_id, username, page, limit } = validatedBody;
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
    query.service_endpoint = "sep_static";
    query.api_secret = "qas_static";
    query.api_username = "au_name_static";
    const added_account = await AddAccount(query);

    query.account_id = added_account._id ;

    const added_account_technicals = await AddAccountTechnicals(query);
    console.log("added_account",added_account);
    console.log("added_account_technicals",added_account_technicals);
    if(Object.keys(added_account).length >0 & Object.keys(added_account_technicals).length>0)
    {
      res.status(200).send({
        added_account: added_account,
        added_account_technicals: added_account_technicals,
        message: "account created",
      });
 
    }else{
      res.status(400).send({
        message : "account could not got added"
      });

    }
    
  } catch (e) {
    return next(e);
  }
};

//update_account
const update_account = async (req, res, next) => {
  try {


    const update_account = await AccountTable.updateOne(
      { _id: req.body._id }, // Specify the filter to match the document
      { $set: { account_name: req.body.account_name, account_type: req.body.account_type, environment: req.body.environment, currency: req.body.currency, status: req.body.status } } // Specify the update operation
    );

    const update_account_technical = await AccountsTechnicalsTable.updateOne(
      { account_id: req.body._id }, // Specify the filter to match the document
      { $set: { account_name: req.body.account_name, account_type: req.body.account_type, environment: req.body.environment, currency: req.body.currency, status: req.body.status } } // Specify the update operation
    );
    
    //const updated_account = await AccountTechnicalsUpdate(req.body);
    console.log("updated_account", update_account);
    if (update_account^update_account_technical) {
      res.status(200).send({
        updated_account: update_account,
        update_account_technical : update_account_technical,
        message: "account details updated",
      });
    } else {
      res.status(400).send({
        updated_account: update_account,
        update_account_technical : update_account_technical,
        message: "account details could not updated",
      });
    }
  } catch (e) {
    console.log("error from update_account", e);
  }
};

//add account_techicals
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
  add_account_techicals: add_account_techicals,
  update_account: update_account,
};
