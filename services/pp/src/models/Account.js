'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const smObj = require('../../../../SMDB/dbObject');

// let accountSchema = new Schema({
//     client_id: {
//         type: Schema.Types.ObjectId,
//         ref: 'clients'
//     },
//     username: {
//         type: String,
//         default : null,
//     },
//     password: {
//         type: String,
//         default : null,
//     },
//     status: {
//         type: String,
//         default : "online",
//         required : true,
//     },
//     created_at: {
//         type: Date,
//         default: ""
//     },
//     updated_at: {
//         type: Date,
//         default: ""
//     }
// })
smObj.Account.client_id.type = Schema.Types.ObjectId;
let accountSchema = new Schema(smObj.Account);

mongoose.model('Accounts', accountSchema);