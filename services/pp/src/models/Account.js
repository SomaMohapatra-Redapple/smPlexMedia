'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const smObj = require('../../../../SMDB/dbObject');
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;


function modifyObjectForObjectId(obj) {
  for (const key in obj) {
    if (!obj[key].hasOwnProperty('type') && typeof obj[key] === 'object' && obj[key] !== null) {
      modifyObjectForObjectId(obj[key]);
    } else {
      if (obj[key].hasOwnProperty('isObjectId') && obj[key].isObjectId === true) {
        obj[key].type = Schema.Types.ObjectId;
        delete obj[key].isObjectId;
      }
    }
  }
}

modifyObjectForObjectId(smObj);

let accountSchema = new Schema(smObj.Account);

mongoose.model('Accounts', accountSchema);