const AdminTable = require("../models/Admin");

const AddToAdminTable = async (query) => {
  const admin = await AdminTable.create(query);
  return admin;
};
const FindAdmin = async (query) => {
  const admin = await AdminTable.findOne(query);
  return admin;
};

module.exports = {
  AddToAdminTable: AddToAdminTable,
  FindAdmin: FindAdmin,
};
