'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let gameSchema = new Schema({
    game_provider_id: {
        type: Schema.Types.ObjectId,
        ref: 'providers',
        required : true,
    },
    game_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required : true,
    },
    game_name: {
        type: String,
        required : true,
    },
    game_image: {
        type: String,
        required : true,
    },
    game_code: {
        type: String,
        required : true,
    },
    is_featured: {
        type: Boolean,
        required : true,
    },
    is_jackpot: {
        type: Boolean,
        required : true,
    },
    is_popular: {
        type: Boolean,
        required : true,
    },
    is_new: {
        type: Boolean,
        required : true,
    },
    game_tag_image: {
        type: String,
        default : null,
    },
    game_type: {
        type: String,
        required : true,
    },
    game_order: {
        type: String,
        required : true,
    },
    status: {
        type: String,
        // default : "online",
        required : true,
    },
    release_date: {
        type: Date,
        required : true,
    },
    game_type_name: {
        type: String,
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


mongoose.model('Game', gameSchema);