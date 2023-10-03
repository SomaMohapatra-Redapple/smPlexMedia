const Joi = require('joi').extend(require('@joi/date'));
const timeLib = require('../../libs/timeLib');
const appConfig = require('../../../config/appConfig');

const clientSmBalanceSchema = Joi.object({
    currency: Joi.string().required(),
    amount: Joi.number().required().allow(0),
    bonus: Joi.number().required().allow(0)
});

const clientAuthenticationValidateSchema = Joi.object({
    amount: Joi.number().required().allow(0),
    currency: Joi.string().required(),
    bonus: Joi.number(),
    country: Joi.string(),
    jurisdiction: Joi.string()
});

const clientBetValidateSchema = Joi.object({
    transaction_status: Joi.boolean().required(),
    available_balance: Joi.number().required().allow(0),
    code: Joi.string().required(),
    currency: Joi.string().required(),
    bonus: Joi.number(),
    round_id: Joi.string().required(),
    txn_id: Joi.string().required(),
    operator_transaction_id: Joi.string().required().allow(null),
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
            default:
                value.error = true;
                break;
        }

        if (value.hasOwnProperty('error')) {
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