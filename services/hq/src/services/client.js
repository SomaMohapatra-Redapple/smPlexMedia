const ClientTable = require("../models/Client");

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
module.exports = {
  AddClient: AddClient,
  FindAllClient: FindAllClient,
  UpdateClientBalance: UpdateClientBalance,
  FindSpecificClient: FindSpecificClient,
};
