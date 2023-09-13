'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let playerSchema = new Schema({
    account_id: {
        type: Schema.Types.ObjectId,
        ref: 'accounts',
    },
    account_user_id: {
        type: String,
        required : true,
    },
    username: {
        type: String,
        default : null,
    },
    currency_code: {
        type: String,
        required : true,
    },
    language_code: {
        type: String,
        required : true,
    },
    status: {
        type: String,
        // default : "online",
        required : true,
    },
    created_at: {
        type: Date,
        default: ""
    },
    updated_at: {
        type: Date,
        default: ""
    }
})


mongoose.model('Player', playerSchema);