'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const smObj = require('../../../../SMDB/dbObject');
// let categorySchema = new Schema({
//     game_provider_id: {
//         type: Schema.Types.ObjectId,
//         ref: 'providers',
//         required : true,
//     },
//     category: {
//         type: String,
//         required : true,
//     },
//     category_icon: {
//         type: String,
//         required : true,
//     },
//     category_order: {
//         type: String,
//         required : true,
//     },
//     status: {
//         type: String,
//         // default : "online",
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

smObj.Category.game_provider_id.type = Schema.Types.ObjectId;
let categorySchema = new Schema(smObj.Category);


mongoose.model('Category', categorySchema);