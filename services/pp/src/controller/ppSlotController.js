let responseLib = require('../libs/responseLib');
let ppClientSmValidator = require('../middlewares/validator/ppClientSmValidator');
let axios = require("axios").default;
let mongoose = require('mongoose');
let AccountsTechnicalsModel = mongoose.model('AccountsTechnicals');
let PlayerModel = mongoose.model('Player');
let checkLib = require('../libs/checkLib');
let commonController = require('../controller/commonController');
let walletController = require('../controller/walletController');


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
        const payLoad = {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if theirsystem   has   internal   problem   and   cannot   process   the   request   andOperator logic does not require a retry of the request. Request will NOTfollow Reconciliation process"
        }

        res.status(200).send(payLoad);
    }
}

let getGameUrl = async () => {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

let authenticate = async (req, res) => {
    try {
        const tokenStr = req.body.token;
        const hash = req.body.hash;
        const providerId = req.body.providerId;

        const tokenValid = await isTokenvalid(tokenStr);

        if (tokenValid.error > 0) {
            return res.status(200).send(tokenValid)
        }

        let splitToken = tokenStr.split("-ucd-");
        let usercode = splitToken[1];
        const userdtls = await commonController.checkUsercodeExists(usercode);
        let account_user_id = userdtls.client_user_id;
        let account_id = userdtls.client_id;

        let acountDetails = await AccountsTechnicalsModel.findOne({ account_id: account_id }).lean();
        if (checkLib.isEmpty(acountDetails)) {
            const payLoad = {
                error: 2,
                description: "Player not found or is logged out. Should be returned in the response onany request sent by Pragmatic Play if the player can’t be found or islogged out at Casino Operator’s side"
            }

            return res.status(200).send(payLoad);
        } else {
            let config = {
                method: 'post',
                url: `${acountDetails.service_endpoint}/authenticate?function=authenticate`,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    user_id: userdtls.account_user_id                       // YMDJD12
                }
            };

            let response = await axios(config);
            let responseData = response.data.data

            let payLoad = {
                status: 200,
                userId: usercode,
                currency: userdtls.currency_code,
                cash: responseData.cash,
                bonus: 0,
                token: tokenStr,
                country: responseData.country,
                jurisdiction: responseData.jurisdiction,
                error: 0,
                description: "Success"
            }

            return res.status(200).send(payLoad);
        }
    } catch (error) {
        console.log(error.message);
        const payLoad = {
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
        const bodyData = req.body;
        const usercode = bodyData.userId;
        const token = bodyData.token;
        const betamount = bodyData.amount;
        const gamecode = bodyData.gameId; // provider game ID
        const reference = bodyData.reference; // provider transction ID
        const roundId = bodyData.roundId; //provider Id of the round

        const required_field = { hash: '', userId: '', providerId: '', gameId: '', roundId: '', amount: '', roundDetails: '', reference: '', timestamp: '' };
        const checkrequiredfield = Object.keys(required_field).every(key => Object.keys(bodyData).includes(key));

        if (!checkrequiredfield || betamount < 1) {
            Status = 'Bad parameters in the request, please check post parameters.';
            code = 7;
            return await invalidError(code, Status);
        }

        const tokenValid = await isTokenvalid(tokenStr);
        if (check.checkObjectLen(tokenValid) > 0) {
            return tokenValid;
        }

        /*** get user detail ***/
        let userdtls = await commonController.checkUsercodeExists(usercode);

        let account_user_id = userdtls.account_user_id;
        let account_id = userdtls.account_id;

        // do the hash calculation here

        //

        /* ************* Checking Bet Rejection *************** */

        let isBetEnable = await walletController.betControlStatus(account_id, provider_id);
        if ((isBetEnable.rejectionStatus == true) || (isBetEnable.maintenance_mode_status == 'Y')) {
            Status = 'Maintenance in progress. Try again later!';
            code = 7;
            return await invalidError(code, Status);
        }
        /* **************************************************** */

        let acountDetails = await AccountsTechnicalsModel.findOne({ account_id: account_id }).lean();
        if (checkLib.isEmpty(acountDetails)) {
            const payLoad = {
                error: 2,
                description: "Player not found or is logged out. Should be returned in the response onany request sent by Pragmatic Play if the player can’t be found or islogged out at Casino Operator’s side"
            }

            return res.status(200).send(payLoad);
        }

        let config = {
            method: 'post',
            url: `${acountDetailsservice_endpoint}/user-balance?function=balance`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                "user_id": "1234567890"
            }
        };

        let response = await axios(config);







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
            let userData = commonController.checkUsercodeExists(userId);
            let checkUserData = checkLib.isEmpty(userData);

            if (checkUserData == true) {
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



