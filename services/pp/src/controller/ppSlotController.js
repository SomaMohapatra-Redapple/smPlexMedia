let responseLib = require('../libs/responseLib');
let ppClientSmValidator = require('../middlewares/validator/ppClientSmValidator');
let axios = require("axios").default;
let mongoose = require('mongoose');
let AccountsTechnicalsModel = mongoose.model('AccountsTechnicals')
let PlayerModel = mongoose.model('Player');
let checkLib = require('../libs/checkLib');


//// This the function handler
let handler = async (req, res) => {
    try {
        let response;
        let payLoad;
        let apiResponse;
        switch (req.params.function) {
            case "getGameUrl":
                response = await getGameUrl();
                break;
            case "authenticate":
                response = await authenticate(req, res);
                break;
            case "balance":
                response = await balance(req, res);
                break;
            case "bet":
                response = await bet(req, res);
                break;
            default:
                apiResponse = responseLib.generate(false, "No Function defined", {});
                res.status(200).send(apiResponse);
                break;
        }
    } catch (error) {
        console.log(error);
        let apiResponse = responseLib.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

let getGameUrl = async () => {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

let authenticate = async () => {
    try {
        const tokenStr = req.body.token;
        const hash = req.body.hash;
        const providerId = req.body.providerId;

        const tokenValid = await isTokenvalid(tokenStr);

        if (tokenValid.error == 0) {
            let splitToken = tokenStr.split("-ucd-");
            let usercode = splitToken[1];
            let playerDetails = await PlayerModel.findOne({ _id: usercode }).lean();

        } else {
            res.status(200).send(tokenValid)
        }

        let payLoad = {
            status: 200,
            userId: usercode,
            currency: userdtls.currency,
            cash: balance,
            bonus: 0,
            token: tokenStr,
            country: 'US',
            jurisdiction: setdata.jurisdiction,
            error: 0,
            description: "Success"
        }

        return res.status(200).send(payLoad);

    } catch (error) {
        console.log(error.message);
        const errArr = {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
        }

        return res.status(200).send(payLoad);
    }
}

let balance = async (req, res) => {
    try {
        let acountDetails = await AccountsTechnicalsModel.find({ client_id: `650ad4f9a08fe4a5e828815c`, account_id: `650ad363a08fe4a5e8288155` }).lean();

        let config = {
            method: 'post',
            url: `${acountDetails[0].service_endpoint}/user-balance?function=balance`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                "user_id": "1234567890"
            }
        };

        let response = await axios(config);

        // checking the response has any error or not
        if (response.data.err == false) {
            let responseData = response.data.data;
            let function_name = "balance";

            let responseCheck = await ppClientSmValidator.ppSmValidator(function_name, responseData);

            // checking the data format has any error or not
            if (responseCheck.error == false) {
                let payLoad = {
                    "currency": response.data.data.currency,
                    "cash": response.data.data.cash,
                    "bonus": response.data.data.bonus,
                    "error": 0,
                    "description": "Success"
                }
                return res.status(200).send(payLoad);

            } else {
                let payLoad = {
                    "currency": "",
                    "cash": 0,
                    "bonus": 0,
                    "error": 1,
                    "description": "error"
                }

                return res.status(200).send(payLoad);
            }

        } else {
            let payLoad = {
                "currency": "",
                "cash": 0,
                "bonus": 0,
                "error": 1,
                "description": "error"
            }

            return res.status(200).send(payLoad);
        }


    } catch (error) {
        console.log(error.message);
        let payLoad = {
            "currency": "",
            "cash": 0,
            "bonus": 0,
            "error": 1,
            "description": error.message
        }

        return res.status(200).send(payLoad);
    }
}

let bet = async (req, res) => {
    try {

    } catch (error) {
        console.log(error.message);
    }
}


/*************************************************************************************************/ /* This is the required functions for API's */

let userBalance = async () => {
    let acountDetails = await AccountsTechnicalsModel.find({ client_id: `650ad4f9a08fe4a5e828815c`, account_id: `650ad363a08fe4a5e8288155` }).lean();

    let config = {
        method: 'post',
        url: `${acountDetails[0].service_endpoint}/user-balance?function=balance`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            "user_id": "1234567890"
        }
    };

    let response = await axios(config);
}

let checkUserExists = async (data) => {

}

let isTokenvalid = async (tokenStr) => {
    let requestsend = {};
    let tokenValidate = tokenStr.includes('-ucd-') ? true : false;

    if (tokenValidate == true) {
        let splitToken = tokenStr.split("-ucd-");
        let userId = splitToken[1];
        let checkUserId = checkLib.isEmpty(userId);

        if (checkUserId == true) {
            requestsend = {
                error: 4,
                description: 'Player authentication failed due to invalid, not found or expired token'
            }
        } else {
            requestsend = {
                error: 0,
                description: 'This is valid Token'
            }
        }
    } else {
        requestsend = {
            error: 4,
            description: 'Player authentication failed due to invalid, not found or expired token'
        }
    }

    return requestsend;
}

let isHashvalid = async (parameter, client_id) => {

    let reqhash = '';
    let requestsend = {};
    let setdata = {};
    if (parameter.hasOwnProperty('hash')) {
        reqhash = parameter.hash;
        delete parameter.hash;
    }


    let provider_params = await commonController.get_provider_params(client_id, this.provider_id, {}, 'SM', 'SLOT');
    provider_params.forEach(element => {
        setdata[element.field_key] = element.field_value;
    });

    parameter = check.removeEmpty(parameter); // removing blank values

    parameter = check.sortObj(parameter); // sorting object
    let finalstring = httpBuildQuery(parameter) + setdata.key; //converting json to string
    let md5hash = check.createMd5hash(finalstring);
    console.log('createdmd5====>>', md5hash);
    console.log('requestedmd5===>', reqhash);

    if (md5hash != reqhash) {
        let errmsg = "Invalid hash code. Should be returned in the response on any request sent by Pragmatic Play if the hash code validation is failed.";
        requestsend = await invalidError(5, errmsg);
    }

    return requestsend;
}

let invalidError = async (errocode, description) => {
    return {
        error: errocode,
        description: description
    }
}

module.exports = {
    handler: handler
}



