const ClientTable = require("../models/Client");

const AddClient = async (query) => {
    console.log("query",query);
    const client = await ClientTable.create(query);
    console.log("client",client);
    return client;
  };
const FindAllClient = async (query) => {
  const client = await ClientTable.find(query);
  return client;
};
const FindSpecificClient = async (query) => {
  const client = await ClientTable.findOne(query);
  return client;
};
const UpdateClientBalance = async (query,options) => {
  const balance = await ClientTable.update(query,options);
  console.log("balance",balance);
  return balance ;
}
module.exports = {
  AddClient : AddClient,
  FindAllClient: FindAllClient,
  UpdateClientBalance : UpdateClientBalance,
  FindSpecificClient : FindSpecificClient
};