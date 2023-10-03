
const Joi = require('joi').extend(require('@joi/date'));


const clientGetBalanceValidateSchema = Joi.object({
    cash: Joi.number().required().allow(0),
}).unknown();

let clientResponseValidator = async (data, function_name) => {

    try {
        console.log(data);
        let value = {};
        switch (function_name) {
            case "login":
                value = await mgReqValidateSchema.validate(data);
                break;
            case "transaction":
                value = await mgReqBetValidateSchema.validate(data);
                break;
            case "rollback":
                value = await mgReqWinValidateSchema.validate(data);
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
