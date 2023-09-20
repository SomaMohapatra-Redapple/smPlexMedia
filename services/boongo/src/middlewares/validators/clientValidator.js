
const Joi = require('joi').extend(require('@joi/date'));


const boongoGetBalanceValidateSchema = Joi.object({
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


let boongoReqValidator = async (req, res, next) => {

    try {
        let value = {};
        switch (req.params.function) {

            case "callback":

                switch (req.body.name) {
                    case "login":
                        value = await boongoReqValidateSchema.validate(req.body);
                        break;
                    case "transaction":
                        value = await boongoReqBetValidateSchema.validate(req.body);
                        break;
                    case "rollback":
                        value = await boongoReqWinValidateSchema.validate(req.body);
                        break;
                    case "getbalance":
                        value = await boongoGetBalanceValidateSchema.validate(req.body);
                        break;
                    case "logout":
                        value = await boongoReqValidateSchema.validate(req.body);
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

