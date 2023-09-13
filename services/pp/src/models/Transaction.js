'use strict'
/**
 * Module Dependencies
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let transactionSchema = new Schema({
    session_id: {
        type: String,
        required : true,
    },
    account_id: {
        type: Schema.Types.ObjectId,
        ref: 'accounts',
    },
    account_user_id: {
        type: String,
        required : true,
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'players',
    },
    game_id: {
        type: Schema.Types.ObjectId,
        ref: 'games',
    },
    game_name: {
        type: String,
        required : true,
    },
    provider_id: {
        type: Schema.Types.ObjectId,
        ref: 'providers',
    },
    provider_name: {
        type: String,
        required : true,
    },
    game_category_id: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
    },
    game_category_name: {
        type: String,
        required : true,
    },
    bet_id: {
        type: String,
        required : true,
    },
    round_id: {
        type: String,
        required : true,
    },
    operator_transaction_id: {
        type: String,
        required : true,
    },
    transaction_amount: {
        type: Number,
        required : true,
    },
    transaction_type: {
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


mongoose.model('Transaction', transactionSchema);