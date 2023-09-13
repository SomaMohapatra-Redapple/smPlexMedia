'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let clientSchema = new Schema({
    client_name: {
        type: String,
        required : true,
    },
    contact: {
        type: String,
        default : null,
    },
    email: {
        type: String,
        default : null,
    },
    username: {
        type: String,
        required : true,
    },
    password: {
        type: String,
        required : true,
    },
    status: {
        type: String,
        default : "online",
        required : true,
    },
    environment: {
        type: String,
        default : "staging",
        required : true,
    },
    created_by : {
        type: String,
        default : null
    },
    updated_by : {
        type: String,
        default : null
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


mongoose.model('Client', clientSchema);