'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const smObj = require('../../../../SMDB/dbObject');

function modifyObjectForObjectId(obj) {
    for (const key in obj) {
      if (!obj[key].hasOwnProperty('type') && typeof obj[key] === 'object' && obj[key] !== null) {
        modifyObjectForObjectId(obj[key]);
      } else {
        if(obj[key].hasOwnProperty('isObjectId') && obj[key].isObjectId === true){
            obj[key].type = Schema.Types.ObjectId;
            delete obj[key].isObjectId;
        }
      }
    }
  }
  
  modifyObjectForObjectId(smObj);
  
let accountSchema = new Schema(smObj.Account);
let accountTechnicalsSchema = new Schema(smObj.AccountTechnicals);
let categorySchema = new Schema(smObj.Category);
let clientSchema = new Schema(smObj.Client);
let gameSchema = new Schema(smObj.Game);
let playerSchema = new Schema(smObj.Player);
let providerSchema = new Schema(smObj.Provider);
let superAdminSchema = new Schema(smObj.SuperAdmin);
let transactionSchema = new Schema(smObj.Transaction);
let client_provider_mapping = new Schema(smObj.Client_provider_mapping);
let client_game_mapping = new Schema(smObj.Client_game_mapping);

mongoose.model('Accounts', accountSchema);
mongoose.model('AccountsTechnicals', accountTechnicalsSchema);
mongoose.model('Category', categorySchema);
mongoose.model('Client', clientSchema);
mongoose.model('Game', gameSchema);
mongoose.model('Player', playerSchema);
mongoose.model('Provider', providerSchema);
mongoose.model('SuperAdmin', superAdminSchema);
mongoose.model('Transaction', transactionSchema);
mongoose.model('Client_provider_mapping', client_provider_mapping);
mongoose.model('Client_game_mapping', client_game_mapping);