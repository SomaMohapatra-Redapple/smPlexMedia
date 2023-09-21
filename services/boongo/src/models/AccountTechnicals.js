'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const smObj = require('../../../../SMDB/dbObject');
let accountTechnicalsSchema = new Schema(smObj.AccountTechnicals);


mongoose.model('AccountsTechnicals', accountTechnicalsSchema);