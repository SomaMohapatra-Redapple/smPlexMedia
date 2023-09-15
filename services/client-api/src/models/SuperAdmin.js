'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let superAdminSchema = new Schema({
    admin_name: {
        type: String,
        required : true,
    },
    contact: {
        type: String,
        default : null,
    },
    email: {
        type: String,
        required : true,
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
    created_at: {
        type: Date,
        default: ""
    },
    updated_at: {
        type: Date,
        default: ""
    }
})


mongoose.model('SuperAdmin', superAdminSchema);