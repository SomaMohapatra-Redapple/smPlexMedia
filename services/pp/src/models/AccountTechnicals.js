'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const smObj = require('../../../../SMDB/dbObject');
// let accountTechnicalsSchema = new Schema({
//     client_id: {
//         type: Schema.Types.ObjectId,
//         ref: 'clients'
//     },
//     account_id: {
//         type: Schema.Types.ObjectId,
//         ref: 'accounts'
//     },
//     api_username: {
//         type: String,
//         required : true,
//     },
//     api_secret: {
//         type: String,
//         required : true,
//     },
//     service_endpoint: {
//         type: String,
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
smObj.AccountTechnicals.client_id.type = Schema.Types.ObjectId;
smObj.AccountTechnicals.account_id.type = Schema.Types.ObjectId;
let accountTechnicalsSchema = new Schema(smObj.AccountTechnicals);


mongoose.model('AccountsTechnicals', accountTechnicalsSchema);