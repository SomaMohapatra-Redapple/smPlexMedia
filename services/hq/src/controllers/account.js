const Joi = require("joi");
const apiError = require("../libs/apiError");
const responseMessage = require("../libs/responseMessage");
const account = require("../services/account");
const { AddAccount, ShowAccount } = account;

//add account
const add_account = async (req, res, next) => {
  try {
    const query = validatedBody.value;
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
