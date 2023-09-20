
const Joi = require('joi').extend(require('@joi/date'));


const boongoReqValidateSchema = Joi.object({
    token: Joi.required(),
    callback_id: Joi.required(),
    name: Joi.required(),
    signature: Joi.required(),
});

const boongoReqBetValidateSchema = Joi.object({
    token: Joi.required(),
    callback_id: Joi.required(),
    name: Joi.required(),
    signature: Joi.required(),
    data: Joi.object({
        round_id: Joi.required(),
        action_id: Joi.required(),
        amount: Joi.required(),
        currency: Joi.required(),
        details: Joi.required()
    })
});


const boongoReqWinValidateSchema = Joi.object({
    token: Joi.required(),
    callback_id: Joi.required(),
    name: Joi.required(),
    signature: Joi.required(),
    data: Joi.object({
        round_id: Joi.required(),
        action_id: Joi.required(),
        final_action: Joi.required(),
        amount: Joi.required(),
        currency: Joi.required(),
        details: Joi.required()
    })
});

const boongoReqRefundValidateSchema = Joi.object({
    token: Joi.required(),
    callback_id: Joi.required(),
    name: Joi.required(),
    signature: Joi.required(),
    data: Joi.object({
        refund_round_id: Joi.required(),
        refund_action_id: Joi.required(),
        refund_callback_id: Joi.required(),
        amount: Joi.required(),
        currency: Joi.required(),
        details: Joi.required(),
        round_id: Joi.required()
    })
});

const getGameUrlValidateSchema = Joi.object({
    user_code: Joi.required(),
    mode: Joi.required(),
    game: Joi.required(),
    lang: Joi.required(),
    token: Joi.required(),
    return_url: Joi.required(),
})

const getGameUrlHeaderValidateSchema = Joi.object({
    authorization: Joi.required(),
    client_id: Joi.required(),
})

let boongoReqValidator = async (req, res, next) => {

    try {
        let value;
        switch (req.params.function) {

            case "callback":

                switch (req.body.name) {
                    case "init":
                        value = await boongoReqValidateSchema.validate(req.body);
                        break;
                    case "bet":
                        value = await boongoReqBetValidateSchema.validate(req.body);
                        break;
                    case "win":
                        value = await boongoReqWinValidateSchema.validate(req.body);
                        break;
                    case "refund":
                        value = await boongoReqRefundValidateSchema.validate(req.body);
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

        console.log('Boongo validation catch error :', err.message);
        const errArr = {
            status: "error",
            data: { "scope": "user", "no_refund": 1, "message": "Invalid request parameter" }
        }
        res.status(200).send(errArr);
    }
}

module.exports = {
    boongoReqValidator: boongoReqValidator
}

