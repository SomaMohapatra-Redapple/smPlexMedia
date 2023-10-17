
const Joi = require('joi').extend(require('@joi/date'));


const mgGetBalanceValidateSchema = Joi.object({
    req_id: Joi.string().required(),
    timestamp: Joi.string().required(),
    token: Joi.string().required(),
    account_ext_ref: Joi.string().required(),
    account_id: Joi.string().required(),
    currency: Joi.string().required()
}).unknown();
const mgAuthValidateSchema = Joi.object({
    req_id: Joi.string().required(),
    timestamp: Joi.string().required(),
    token: Joi.string().required()
}).unknown();

const mgTransactionValidateSchema =  Joi.object({
    req_id: Joi.string().required(),
    timestamp: Joi.string().required(),
    token: Joi.string().required(),
    account_ext_ref: Joi.string().required(),
    account_id: Joi.string().required(),
    category: Joi.string().required(),
    currency: Joi.string().required(),
    tx_id: Joi.string().required(),
    item_id: Joi.number().integer().options({ convert: false }),
    round_id: Joi.string().required(),
    amount: Joi.string().required(),
}).unknown();


const getGameUrlValidateSchema = Joi.object({
    name: Joi.string().required(),
    account_id: Joi.string().required(),
    user_code: Joi.string().required(),
    token: Joi.string().required(),
    language: Joi.string().required(),
    currency: Joi.string().required(),
    game_code: Joi.string().required(),
    return_url: Joi.string().required()   
});

let microgamingReqValidator = async (req, res, next) => {

    try {
        let value = {};
        switch (req.params.function) {

            case "balance":
                value = await mgGetBalanceValidateSchema.validate(req.body);
                break;
            case "authenticate":
                value = await mgAuthValidateSchema.validate(req.body);
                break;
            case "transaction":
                value = await mgTransactionValidateSchema.validate(req.body);
                break;
            case "getGameUrl":

                // value = await getGameUrlHeaderValidateSchema.validate(req.headers);

                // if (value.hasOwnProperty('error')) {
                //     break;
                // }
                console.log('====>>', req.body);
                value = await getGameUrlValidateSchema.validate(req.body);
                break;

            default:
                value.error = true;
                break;
        }

        if (value.hasOwnProperty('error')) {
            console.log('Err Value : ', value)
            const errArr = {
                "status": "error",
                "data": { "scope": "user", "no_refund": 1, "message": "Invalid request parameter" }
            }
            res.status(200).send(errArr);

        } else {
            next();
        }

    } catch (err) {

        console.log('Microgaming validation catch error :', err.message);
        const errArr = {
            status: "error",
            data: { "scope": "user", "no_refund": 1, "message": "Invalid request parameter" }
        }
        res.status(200).send(errArr);
    }
}

module.exports = {
    microgamingReqValidator: microgamingReqValidator
}

