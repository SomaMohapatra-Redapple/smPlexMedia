const Joi = require('joi').extend(require('@joi/date'));
const timeLib = require('../../libs/timeLib');
const appConfig = require('../../../config/appConfig');

const clientSmBalanceSchema = Joi.object({
    currency: Joi.string().required(),
    amount: Joi.number().required().allow(0),
    bonus: Joi.number().required().allow(0)
});



let ppSmValidator = async (function_name, responseData) => {
    try {
        let value = {};
        switch (function_name) {
            case "authenticate":
                value = await reqAuthValidateSchema.validate();
                break;
            case "balance":
                value = await clientSmBalanceSchema.validate();
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