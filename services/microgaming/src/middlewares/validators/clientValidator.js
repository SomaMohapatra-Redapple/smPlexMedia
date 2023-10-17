
const Joi = require('joi').extend(require('@joi/date'));

const mgReqValidateSchema = Joi.object({
    amount: Joi.number().required()
}).unknown();
const clientGetBalanceValidateSchema = Joi.object({
    amount: Joi.number().required().allow(0),
}).unknown();
const mgReqTransValidateSchema = Joi.object({
    txn_id: Joi.string().required(),
    available_balance:Joi.number().required(),
    operator_transaction_id: Joi.string().required(),
    //round_id: Joi.string().required(),
}).unknown();




let clientResponseValidator = async (data, function_name) => {

    try {
        let value = {};
        switch (function_name) {
            case "authenticate":
                //console.log("i'm in validator section",data.data);
                value = await mgReqValidateSchema.validate(data.data);
                break;
            case "transaction":
                value = await mgReqTransValidateSchema.validate(data);
                break;
            case "balance":
                value = await clientGetBalanceValidateSchema.validate(data);
                break;
            case "logout":
                value = await mgReqValidateSchema.validate(data);
                break;
            default:
                value.error = true;
                break;
        }

        if (value.hasOwnProperty('error')) {
            console.log('Err Value : ', value)
            return {
                error : true,
                message : value.error,
            }

        } else {
            return {
                error : false,
                message : "",
            }
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
    validateResponse: clientResponseValidator
}

