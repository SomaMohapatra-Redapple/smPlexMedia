/**
 * 
 * @author Rajdeep Adhikary
 * @purpose Boongo client provider api validation
 * @createdDate Sep 26 2023
 * @lastUpdated Sep 26 2023
 * @lastUpdatedBy Rajdeep Adhikary
 */


const Joi = require('joi').extend(require('@joi/date'));


const boongoGetBalanceValidateSchema = Joi.object({
    name: Joi.string().required(),
    uid: Joi.string().required(),
    session: Joi.string().required(),
    token: Joi.string().required(),
    game_id: Joi.string().required(),
    game_name: Joi.string().required(),
    provider_id: Joi.string().required(),
    provider_name: Joi.string().required(),
    c_at: Joi.date().iso().required(),
    sent_at: Joi.date().iso().required(),
    args: Joi.object({
        player: Joi.object({
            id: Joi.string().required(),
            brand: Joi.string().required(),
            mode: Joi.string().required(),
            is_test: Joi.boolean().required(),
            currency: Joi.string().required()
        }),
        tag : Joi.string().allow('')
    })
});

const boongoLoginValidateSchema = Joi.object({
    name: Joi.string().required(),
    uid: Joi.string().required(),
    session: Joi.string().required(),
    token: Joi.string().required(),
    game_id: Joi.string().required(),
    game_name: Joi.string().required(),
    provider_id: Joi.string().required(),
    provider_name: Joi.string().required(),
    c_at: Joi.date().iso().required(),
    sent_at: Joi.date().iso().required(),
    args: Joi.object({
        platform: Joi.string().required()
    })
});

const boongoTransactionValidateSchema = Joi.object({
    name: Joi.string().required(),
    uid: Joi.string().required(),
    session: Joi.string().required(),
    token: Joi.string().required(),
    game_id: Joi.string().required(),
    game_name: Joi.string().required(),
    provider_id: Joi.string().required(),
    provider_name: Joi.string().required(),
    c_at: Joi.date().iso().required(),
    sent_at: Joi.date().iso().required(),
    args: Joi.object({
        bet: Joi.string().required().allow(null),
        win: Joi.string().required().allow(null),
        round_started: Joi.boolean().required(),
        round_finished: Joi.boolean().required(),
        round_id: Joi.number().required(),
        player: Joi.object({
            id: Joi.string().required(),
            brand: Joi.string().required(),
            mode: Joi.string().required(),
            is_test: Joi.boolean().required(),
            currency: Joi.string().required()
        }),
        bonus: Joi.string().required().allow(null),
        tag: Joi.string().required().allow('')
    })
});

const boongoRollbackValidateSchema = Joi.object({
    name: Joi.string().required(),
    uid: Joi.string().required(),
    session: Joi.string().required(),
    token: Joi.string().required(),
    game_id: Joi.string().required(),
    game_name: Joi.string().required(),
    provider_id: Joi.string().required(),
    provider_name: Joi.string().required(),
    c_at: Joi.date().iso().required(),
    sent_at: Joi.date().iso().required(),
    args: Joi.object({
        transaction_uid: Joi.string().required(),
        bet: Joi.string().required().allow(null),
        win: Joi.string().required().allow(null),
        round_started: Joi.boolean().required(),
        round_finished: Joi.boolean().required(),
        round_id: Joi.number().required(),
        player: Joi.object({
            id: Joi.string().required(),
            brand: Joi.string(),
            mode: Joi.string().required(),
            is_test: Joi.boolean().required(),
            currency: Joi.string().required()
        }),
        bonus: Joi.string().required().allow(null),
        tag: Joi.string().required().allow('')
    })
});


/**
 * 
 * @author Rajdeep Adhikary
 * @function boongoReqValidator
 * @param {*} req, res, next
 * @returns res/next
 * 
 */

let boongoReqValidator = async (req, res, next) => {

    try {
        let value = {};
        switch (req.body.name) {
            case "login":
                value = await boongoLoginValidateSchema.validate(req.body);
                break;
            case "transaction":
                value = await boongoTransactionValidateSchema.validate(req.body);
                break;
            case "rollback":
                value = await boongoRollbackValidateSchema.validate(req.body);
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

