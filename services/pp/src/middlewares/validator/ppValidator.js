const Joi = require('joi').extend(require('@joi/date'));
const timeLib = require('../../libs/timeLib');
const appConfig = require('../../../config/appConfig');

const reqAuthValidateSchema = Joi.object({
    token: Joi.string().required(),
    hash: Joi.string().required(),
    providerId: Joi.string().allow("", null),
    gameId: Joi.string().allow("", null),
    ipAddress: Joi.string().allow("", null),
    chosenBalance: Joi.string().allow("", null),
    launchingType: Joi.string().allow("", null),
});

const reqBalanceValidateSchema = Joi.object({
    hash: Joi.required(),
    providerId: Joi.required(),
    userId: Joi.required(),
    token: Joi.string().allow("", null),
})

const reqBlcpergameValidateSchema = Joi.object({
    hash: Joi.required(),
    providerId: Joi.required(),
    userId: Joi.required(),
    token: Joi.string().allow("", null),
    platform: Joi.string().allow("", null),
})

const reqendRoundValidateSchema = Joi.object({
    hash: Joi.required(),
    providerId: Joi.required(),
    userId: Joi.required(),
    gameId: Joi.required(),
    roundId: Joi.required(),
    bonusCode: Joi.string().allow("", null),
    roundDetails: Joi.string().allow("", null),
    win: Joi.string().allow("", null),
    token: Joi.string().allow("", null),
    platform: Joi.string().allow("", null),
})

const reqGetcasinoValidateSchema = Joi.object({
    secureLogin: Joi.required(),
    hash: Joi.required(),
    options: Joi.string().allow("", null),
})

const reqAdjustmentValidateSchema = Joi.object({
    hash: Joi.required(),
    userId: Joi.required(),
    gameId: Joi.required(),
    providerId: Joi.required(),
    roundId: Joi.required(),
    amount: Joi.required(),
    reference: Joi.required(),
    validBetAmount: Joi.required(),
    timestamp: Joi.required(),
    token: Joi.string().allow("", null)

})

const reqJackpotWinValidateSchema = Joi.object({
    hash: Joi.required(),
    providerId: Joi.required(),
    timestamp: Joi.required(),
    userId: Joi.required(),
    gameId: Joi.required(),
    roundId: Joi.required(),
    jackpotId: Joi.required(),
    amount: Joi.required(),
    reference: Joi.required(),
    jackpotDetails: Joi.string().allow("", null),
    token: Joi.string().allow("", null),
    platform: Joi.string().allow("", null)
})

const reqbonosWinValidateSchema = Joi.object({
    hash: Joi.required(),
    userId: Joi.required(),
    amount: Joi.required(),
    reference: Joi.required(),
    providerId: Joi.required(),
    timestamp: Joi.required(),
    bonusCode: Joi.string().allow("", null),
    roundId: Joi.string().allow("", null),
    gameId: Joi.string().allow("", null),
    token: Joi.string().allow("", null),
    requestId: Joi.string().allow("", null),
    remainAmount: Joi.string().allow("", null)
})

const reqRefundValidateSchema = Joi.object({
    hash: Joi.required(),
    userId: Joi.required(),
    reference: Joi.required(),
    providerId: Joi.required(),
    platform: Joi.string().allow("", null),
    amount: Joi.string().allow("", null),
    gameId: Joi.string().allow("", null),
    roundId: Joi.string().allow("", null),
    timestamp: Joi.string().allow("", null),
    token: Joi.string().allow("", null),
    bonusCode: Joi.string().allow("", null),
    roundDetails: Joi.string().allow("", null)
})

const reqResultValidateSchema = Joi.object({
    hash: Joi.required(),
    userId: Joi.required(),
    gameId: Joi.required(),
    roundId: Joi.required(),
    amount: Joi.required(),
    reference: Joi.required(),
    providerId: Joi.required(),
    timestamp: Joi.required(),
    roundDetails: Joi.required(),
    bonusCode: Joi.string().allow("", null),
    platform: Joi.string().allow("", null),
    token: Joi.string().allow("", null),
    promoWinAmount: Joi.string().allow("", null),
    promoWinReference: Joi.string().allow("", null),
    promoCampaignID: Joi.string().allow("", null),
    promoCampaignType: Joi.string().allow("", null)
})

const reqBetValidateSchema = Joi.object({
    hash: Joi.required(),
    userId: Joi.required(),
    gameId: Joi.required(),
    roundId: Joi.required(),
    amount: Joi.required(),
    reference: Joi.required(),
    providerId: Joi.required(),
    timestamp: Joi.required(),
    roundDetails: Joi.required(),
    bonusCode: Joi.string().allow("", null),
    language: Joi.string().allow("", null),
    platform: Joi.string().allow("", null),
    jackpotContribution: Joi.string().allow("", null),
    jackpotDetails: Joi.string().allow("", null),
    jackpotId: Joi.string().allow("", null),
    ipAddress: Joi.string().allow("", null),
    token: Joi.string().allow("", null),

})

const reqPromowinValidateSchema = Joi.object({
    hash: Joi.required(),
    providerId: Joi.required(),
    timestamp: Joi.required(),
    userId: Joi.required(),
    campaignId: Joi.required(),
    campaignType: Joi.required(),
    amount: Joi.required(),
    currency: Joi.required(),
    reference: Joi.required(),
    roundId: Joi.string().allow("", null),
    gameId: Joi.string().allow("", null),
    dataType: Joi.string().allow("", null),
})

const getGameUrlValidateSchema = Joi.object({
    mode: Joi.required(),
    usercode: Joi.required(),
    token: Joi.required(),
    account_id : Joi.required(),
    game_id: Joi.required(),
    lang: Joi.required(),
    currency: Joi.required(),
    return_url: Joi.required(),
    // game_code: Joi.string().allow("", null),
})


let ppReqValidator = async (req, res, next) => {

    console.log("functionname : ", req.params.function);

    try {
        let value = {};
        switch (req.params.function) {
            case "authenticate":
                value = await reqAuthValidateSchema.validate(req.body);
                break;
            case "balance":
                value = await reqBalanceValidateSchema.validate(req.body);
                break;
            case "getBalancePerGame":
                value = await reqBlcpergameValidateSchema.validate(req.body);
                break;
            case "endRound":
                value = await reqendRoundValidateSchema.validate(req.body);
                break;
            case "PromoWin":
                value = await reqPromowinValidateSchema.validate(req.body);
                break;
            case "bet":
                value = await reqBetValidateSchema.validate(req.body);
                break;
            case "result":
                value = await reqResultValidateSchema.validate(req.body);
                break;
            case "refund":
                value = await reqRefundValidateSchema.validate(req.body);
                break;
            case "bonusWin":
                value = await reqbonosWinValidateSchema.validate(req.body);
                break;
            case "JackpotWin":
                value = await reqJackpotWinValidateSchema.validate(req.body);
                break;
            case "adjustment":
                value = await reqAdjustmentValidateSchema.validate(req.body);
                break;
            case "GetCasinoGames":
                value = await reqGetcasinoValidateSchema.validate(req.body);
                break;
            case "getGameUrl":

                value = await getGameUrlValidateSchema.validate(req.body);
                break;
            default:
                value.error = true;
                break;
        }


        if (value.hasOwnProperty('error')) {
            console.log('Err Value : ', value);

            // const errArr = {
            //     "status": "error",
            //     "data": { "scope": "user", "no_refund": 1, "message": "Invalid request parameter" }
            // }

            const errArr = {
                error: 7,
                description: "Bad parameters in the request, please check post parameters."
            }
            res.status(200).send(errArr);

        } else {
            next();
        }

    } catch (err) {
        console.log('pp validation catch error :', err.message);

        // const errArr = {
        //     status: "error",
        //     data: { "scope": "user", "no_refund": 1, "message": "Invalid request parameter" }
        // }

        const errArr = {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
        }

        res.status(200).send(errArr);
    }
}

module.exports = {
    ppReqValidator: ppReqValidator
}

