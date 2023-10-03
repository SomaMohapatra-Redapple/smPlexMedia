const { string } = require('joi');

const Joi = require('joi').extend(require('@joi/date'));


const boongoGetBalanceValidateSchema = Joi.object({
    name: Joi.string().required(),
    uid: Joi.string().required(),
    timestamp: Joi.date().iso(),
    session: Joi.string().required(),
    token: Joi.string().required(),
    game_id: Joi.string().required(),
    args: Joi.object({
        player: Joi.object({
            id: Joi.string().required(),
            currency: Joi.string().required()
        }).unknown(),
        tag : Joi.string().allow('')
    })
}).unknown();

const boongoLoginValidateSchema = Joi.object({
    name: Joi.string().required(),
    uid: Joi.string().required(),
    timestamp: Joi.date().iso(),
    session: Joi.string().required(),
    token: Joi.string().required(),
    game_id: Joi.string().required(),
}).unknown();


let boongoReqValidator = async (req, res, next) => {

    try {
        let value = {};
        switch (req.params.function) {

            case "callback":

                switch (req.body.name) {
                    case "login":
                        value = await boongoLoginValidateSchema.validate(req.body);
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
                console.log('====>>', req);
                value = await getGameUrlValidateSchema.validate(req.body);
                break;

            default:
                value.error = true;
                break;
        }

        if (value.hasOwnProperty('error')) {
            console.log('Err Value : ', value)
            let apiResponse = {
                uid: req.body.uid,
                error: {
                  code: 'FATAL_ERROR'
                }
              }
            res.status(200)
            res.send(apiResponse)

        } else {
            next();
        }

    } catch (err) {

        console.log('Boongo validation catch error :', err.message);
        let apiResponse = {
            uid: req.body.uid,
            error: {
              code: 'FATAL_ERROR'
            }
          }
        res.status(200)
        res.send(apiResponse)
    }
}

module.exports = {
    boongoReqValidator: boongoReqValidator
}

