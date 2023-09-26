'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let providerSchema = new Schema({
    game_provider_name: {
        type: String,
        required : true,
    },
    is_subprovider: {
        type: Boolean,  
        required : true,
        default : false,
    },
    parent_game_provider_id: {
        type: Schema.Types.ObjectId,
        ref: 'providers',
        required : false,
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


mongoose.model('Provider', providerSchema);