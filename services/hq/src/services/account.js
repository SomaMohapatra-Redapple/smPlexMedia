//const AccountTable = require("../models/Account");
const mongoose = require('mongoose');
const AccountTable = mongoose.model('Accounts');

const AddAccount = async (query) => {
  return await AccountTable.create(query);
};
const ShowAccount = async (query) => {
  //const {page,limit} = validatedBody;
  return await AccountTable.find(query);
};

module.exports = {
    AddAccount : AddAccount,
    ShowAccount : ShowAccount
}
