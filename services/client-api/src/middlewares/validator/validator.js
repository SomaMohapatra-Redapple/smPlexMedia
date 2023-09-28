const Joi = require('joi').extend(require('@joi/date'));
// const timeLib = require('../../libs/timeLib');
// const appConfig = require('../../../config/appConfig');
const responseLib = require('../../libs/responseLib');

const userBalanceSchema = Joi.object({
    user_id: Joi.string().required()
});

const reqAuthValidateSchema = Joi.object({
    user_id: Joi.string().required()
});

const rollbackSchema = Joi.object({
    txn_id: Joi.string().required()
});

const betSchema = Joi.object({
    user_id: Joi.string().required(),
    game_id: Joi.string().required(),
    round_id: Joi.string().required(),
    txn_id: Joi.string().required(),
    category_id: Joi.string().required(),
    bet_amount: Joi.number().required(),
    bonus: Joi.number().required().allow(0),
    category_id: Joi.string().required(),
});

const winSchema = Joi.object({
    user_id: Joi.string().required(),
    game_id: Joi.string().required(),
    round_id: Joi.string().required(),
    txn_id: Joi.string().required(),
    category_id: Joi.string().required(),
    win_amount: Joi.number().required(),
    bonus: Joi.number().required().allow(0),
    category_id: Joi.string().required(),
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
            case "bet":
                value = await betSchema.validate(req.body);
                break;
            case "win":
                value = await winSchema.validate(req.body);
                break;
            case "rollback":
                value = await rollbackSchema.validate(req.body);
                break;
            default:
                let apiResponse = responseLib.generate(true, `INVALID_REQUEST`, {});
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