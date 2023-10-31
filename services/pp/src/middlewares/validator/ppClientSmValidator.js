const Joi = require('joi').extend(require('@joi/date'));
const timeLib = require('../../libs/timeLib');
const appConfig = require('../../../config/appConfig');

const clientSmBalanceSchema = Joi.object({
    currency: Joi.string().required(),
    amount: Joi.number().required().allow(0),
});

const clientAuthenticationValidateSchema = Joi.object({
    amount: Joi.number().required().allow(0),
    currency: Joi.string().required(),
    bonus: Joi.number(),
    country: Joi.string(),
    jurisdiction: Joi.string()
});

const clientBetValidateSchema = Joi.object({
    available_balance: Joi.number().required().allow(0),
    currency: Joi.string().required(),
    round_id: Joi.string().required(),
    txn_id: Joi.string().required(),
    operator_transaction_id: Joi.string().required().allow(null),

    // available_balance: parseFloat(parseFloat(currentBalance).toFixed(4)),
    // currency: userData.data.currency_code,
    // txn_id: req.body.txn_id,
    // operator_transaction_id: inserData._id,
    // round_id: req.body.round_id
});

const clientResultValidationSchema = Joi.object({
    transaction_status: Joi.boolean().required(),
    bet_amount: Joi.number().required().allow(0),
    code: Joi.string().required(),
    currency: Joi.string().required(),
    bonus: Joi.number(),
    round_id: Joi.string().required(),
    txn_id: Joi.string().required(),
    operator_transaction_id: Joi.string().required().allow(null),
});

const clientRefundValidationSchema = Joi.object({
    // transaction_status: Joi.boolean().required(),
    // code: Joi.string().required(),
    available_balance: Joi.number().required(),
    txn_id: Joi.string().required(),
    operator_transaction_id: Joi.string().required().allow(''),
    currency: Joi.string().required(),
    // bonus: Joi.number(),
    round_id: Joi.string(),


    // available_balance: commonController.toFloat(currentBalance),
    // currency: userData.data.currency_code,
    // txn_id: req.body.txn_id,
    // operator_transaction_id: inserData._id,
    // round_id: trans_details.round_id
});



let ppSmValidator = async (function_name, responseData) => {
    try {
        let value = {};
        switch (function_name) {
            case "authenticate":
                value = await clientAuthenticationValidateSchema.validate(responseData);
                break;
            case "balance":
                value = await clientSmBalanceSchema.validate(responseData);
                break;
            case "bet":
                value = await clientBetValidateSchema.validate(responseData);
                break;
            case "result":
                value = await clientResultValidationSchema.validate(responseData);
                break;
            case "refund":
                value = await clientRefundValidationSchema.validate(responseData);
                break;
            default:
                value.error = true;
                break;
        }

        if (value.hasOwnProperty('error')) {
            console.log("validation error ==> ", value.error)
            return { error: true }
        } else {
            return { error: false }
        }

    } catch (err) {
        return { error: false }
    }
}

module.exports = {
    ppSmValidator: ppSmValidator
}