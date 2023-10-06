// const admin = require("../services/admin");
// const { AddToAdminTable, FindAdmin } = admin;
const mongoose = require('mongoose');
const AdminTable = mongoose.model('SuperAdmin');
const jwt = require("jsonwebtoken");

const AddToAdminTable = async (query) => {
  const admin = await AdminTable.create(query);
  return admin;
};
const FindAdmin = async (query) => {
  const admin = await AdminTable.findOne(query);
  return admin;
};

const add_admin = async (req, res, next) => {
  try {
    //req.body.created_by = req.user.id;
    const query = req.body;
    const admin = await AddToAdminTable(query)
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
  }
};

//admin_login

const admin_login = async (req, res, next) => {
  try {
    const { user_name, password,role } = req.body;
    const query = { user_name: user_name };
    const admin = await FindAdmin(query);
    if(admin){
    console.log("req.connection", req.connection.remoteAddress);
    console.log("req.body", req.body);
    console.log("admin", admin);
    if (role == "admin" && admin.user_name == user_name && admin.password == password) {
      token = jwt.sign(
        { id: admin.id, user_name: admin.user_name },
        process.env.ENC_KEY,
        { expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME }
      );
      res.status(200).send({
        message: "admin has logged in successfully",
        token: token,
      });
    } else {
      res.status(400).send({
        message: "you are not the admin",
      });
    }
      

    }
    else{
      res.status(400).send({
        message : "there is no such admin in admin table"
      })
    }
    
  } catch (e) {
    console.log("error", e);
  }
};

//superadmin_login
const superadmin_login = async (req, res, next) => {
  try {
    const { user_name, password,role } = req.body;
    const query = { user_name: user_name };
    const admin = await FindAdmin(query);
    console.log("req.connection", req.connection.remoteAddress);
    console.log("req.body", req.body);
    console.log("admin", admin);
    if (role == "superadmin" && admin.user_name == user_name && admin.password == password) {
      token = jwt.sign(
        { id: admin.id, user_name: admin.user_name },
        process.env.ENC_KEY,
        { expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME }
      );
      res.status(200).send({
        message: "super admin has logged in successfully",
        token: token,
      });
    } else {
      res.status(400).send({
        message: "you are not the super admin",
      });
    }
  } catch (e) {
    console.log("error", e);
  }
};

module.exports = {
  add_admin: add_admin,
  admin_login: admin_login,
  superadmin_login : superadmin_login
};