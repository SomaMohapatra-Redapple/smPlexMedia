const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admin = new Schema(
  
  {
    client_id: {
      // Integer Datatype
      type: String
    },
    e_mail: {
      type: String
    },
    password: {
      type: String
    },
    status: {
      type: String,
      enum: ["online", "offline"]
    },
    admin_name: {
      type: String,
      unique : true
    },
    user_name: {
      type: String
    },
    contact: {
      type: String
    },
    created_by: {
        type: String
    },
    updated_by: {
        type: String
      }
  },
  {
    freezeTableName: true,
    paranoid : true,
    soft_delete : 'soft_delete',
    created_at : 'created_at',
    modified_at : 'modified_at'
  }
);

const Admin = mongoose.model('Admin', admin);
module.exports = Admin;
