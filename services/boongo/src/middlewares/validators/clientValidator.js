/**
 * 
 * @author Rajdeep Adhikary
 * @purpose Boongo client SM api response validation
 * @createdDate Sep 26 2023
 * @lastUpdated Sep 26 2023
 * @lastUpdatedBy Rajdeep Adhikary
 */
const Joi = require('joi').extend(require('@joi/date'));


const clientGetBalanceValidateSchema = Joi.object({
    amount: Joi.number().required().allow(0),
    currency: Joi.string()
});


const clientAuthenticationValidateSchema = Joi.object({
    amount: Joi.number().required().allow(0),
    currency: Joi.string().required(),
    country: Joi.string(),
    jurisdiction: Joi.string()
});

const clientBetValidateSchema = Joi.object({
    available_balance: Joi.number().required().allow(0),
    currency: Joi.string().required(),
    round_id: Joi.string().required(),
    txn_id: Joi.string().required(),
    operator_transaction_id: Joi.string().required().allow(''),
});

const clientWinValidateSchema = Joi.object({
    available_balance: Joi.number().required().allow(0),
    currency: Joi.string().required(),
    round_id: Joi.string().required(),
    txn_id: Joi.string().required(),
    operator_transaction_id: Joi.string().required().allow(''),
});


const clientRefundValidateSchema = Joi.object({
    available_balance: Joi.number().required().allow(0),
    currency: Joi.string().required(),
    txn_id: Joi.string().required(),
    operator_transaction_id: Joi.string().required().allow(''),
    round_id: Joi.string().required().allow(''),

});

/**
 * 
 * @author Rajdeep Adhikary
 * @function clientResponseValidator
 * @param {*} data 
 * @returns object
 * 
 */
let clientResponseValidator = async (data, function_name) => {

    try {
        let value = {};
        switch (function_name) {
            case "login":
                value = await clientAuthenticationValidateSchema.validate(data);
                break;
            case "bet":
                value = await clientBetValidateSchema.validate(data);
                break;
            case "win":
                value = await clientWinValidateSchema.validate(data);
                break;
            case "rollback":
                value = await clientRefundValidateSchema.validate(data);
                break;
            case "balance":
                value = await clientGetBalanceValidateSchema.validate(data);
                break;
            case "logout":
                value = await boongoReqValidateSchema.validate(data);
                break;
            default:
                value.error = true;
                break;
        }

        if (value.hasOwnProperty('error')) {
            console.log('Err Value : ', value)
            return {
                error : true,
                message : value.error,
            }

        } else {
            return {
                error : false,
                message : "",
            }
        }

    } catch (err) {

        console.log('Boongo validation catch error :', err.message);
        return {
            error : false,
            message : "",
        }
    }
}



module.exports = {
    validateResponse: clientResponseValidator
}

