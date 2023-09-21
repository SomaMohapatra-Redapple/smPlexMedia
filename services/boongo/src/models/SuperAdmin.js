'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const smObj = require('../../../../SMDB/dbObject');
let superAdminSchema = new Schema(smObj.SuperAdmin);


mongoose.model('SuperAdmin', superAdminSchema);