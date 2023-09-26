const Joi = require('joi').extend(require('@joi/date'));
// const timeLib = require('../../libs/timeLib');
// const appConfig = require('../../../config/appConfig');
const responseLib = require('../../libs/responseLib');

const userBalanceSchema = Joi.object({
    user_id: Joi.string().required()
});


let apiValidator = async (req, res, next) => {
    try {
        let value = {};
        switch (req.query.function) {
            case "authenticate":
                value = await reqAuthValidateSchema.validate();
                break;
            case "balance":
                value = await userBalanceSchema.validate(req.body);
                break;
            default:
                let apiResponse = responseLib.generate(true, ` ERROR : ${err.message}`, {});
                res.status(400).send(apiResponse);
                break;
        }

        if (value.hasOwnProperty('error')) {
            throw new Error(value.error);
        } else {
            next();
        }

    } catch (err) {
        let apiResponse = responseLib.generate(true, ` ERROR : ${err.message}`, {});
        res.status(400).send(apiResponse);
    }
}

module.exports = {
    apiValidator: apiValidator
}