const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const paginate =  require('mongoose-paginate');

const account = new Schema(
   
    {
      account_id: {
          // Integer Datatype
          type: String
        },
      client_id: {
        // Integer Datatype
        type: String
      },
      password: {
        type: String
      },
      status: {
        type: String,
        enum: ["online", "offline"]
      },
      user_name: {
        type: String
      },
      account_type: {
        type: String,
        enum: ["BT", "SEAMLESS"]
      },
    },
    {
      freezeTableName: true,
      paranoid : true,
      soft_delete : 'soft_delete',
      created_at : 'created_at',
      modified_at : 'modified_at'
    }
  );

  account.plugin(paginate);
  const Account = mongoose.model('Account', account);
  module.exports = Account;