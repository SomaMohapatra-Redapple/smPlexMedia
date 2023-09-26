
const Joi = require('joi').extend(require('@joi/date'));


const microgamingGetBalanceValidateSchema = Joi.object({
    name: Joi.string().required(),
    uid: Joi.string().required(),
    timestamp: Joi.date().iso(),
    session: Joi.string().required(),
    args: Joi.object({
        token: Joi.string().required(),
        game: Joi.string().required(),
        player: Joi.object({
            id: Joi.string().required(),
            currency: Joi.string().required()
        })
    })
});
const authValidateSchema =  Joi.object({
    req_id: Joi.string().required(),
    timestamp: Joi.string().required(),
    token: Joi.string().required()
}).unknown();

const balanceValidateSchema =  Joi.object({
    req_id: Joi.string().required(),
    timestamp: Joi.string().required(),
    token: Joi.string().required(),
    account_ext_ref: Joi.string().required(),
    account_id: Joi.string().required(),
    currency: Joi.string().required()
}).unknown();

const transactionValidateSchema =  Joi.object({
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
    amount: Joi.number().integer().options({ convert: false }),
}).unknown();

let microgamingReqValidator = async (req, res, next) => {

    try {
        let value = {};
        switch (req.params.function) {

            case "callback":

                switch (req.body.name) {
                    case "login":
                        value = await microgamingReqValidateSchema.validate(req.body);
                        break;
                    case "transaction":
                        value = await microgamingReqBetValidateSchema.validate(req.body);
                        break;
                    case "rollback":
                        value = await microgamingReqWinValidateSchema.validate(req.body);
                        break;
                    case "getbalance":
                        value = await microgamingGetBalanceValidateSchema.validate(req.body);
                        break;
                    case "logout":
                        value = await microgamingReqValidateSchema.validate(req.body);
                        break;
                    default:
                        value.error = true;
                        break;
                }
                break;

            case "getGameUrl":

                // value = await getGameUrlHeaderValidateSchema.validate(req.headers);

                // if (value.hasOwnProperty('error')) {
                //     break;
                // }
                console.log('====>>', req);
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
    microgamingReqValidator: ReqValidator
}

