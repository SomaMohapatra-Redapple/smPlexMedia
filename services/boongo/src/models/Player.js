'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const smObj = require('../../../../SMDB/dbObject');
let playerSchema = new Schema(smObj.Player);


mongoose.model('Player', playerSchema);