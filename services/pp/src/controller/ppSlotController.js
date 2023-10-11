/**
 * 
 * @author Akash Paul
 * @purpose Pragmatic Play provider integration and game launch related works
 * @createdDate Sep 25 2023
 * @lastUpdated Sep 25 2023
 * @lastUpdatedBy Akash Paul
 */

let appConfig = require('../../config/appConfig');
let ProviderID = appConfig.provider_id;
let ppClientSmValidator = require('../middlewares/validator/ppClientSmValidator');
let axios = require("axios").default;
let mongoose = require('mongoose');
let AccountsTechnicalsModel = mongoose.model('AccountsTechnicals');
let PlayerModel = mongoose.model('Player');
let GameModel = mongoose.model('Game');
let ProviderModel = mongoose.model('Provider');
let CategoryModel = mongoose.model('Category');
let TransactionModel = mongoose.model('Transaction');
let checkLib = require('../libs/checkLib');
let timeLib = require('../libs/timeLib');
let commonController = require('../controller/commonController');
let walletController = require('../controller/walletController');
let serverLib = require('../libs/serverLib');


/**
 * 
 * @author Akash Paul
 * @function handler
 * @param {*} req res
 * @returns res
 * 
 */
let handler = async (req, res) => {
    try {
        let response;
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
            case "result":
                response = await result(req, res);
                break;
            case "refund":
                response = await refund(req, res);
                break;
            default:
                response = {
                    error: 120,
                    description: "Internal server error. Casino Operator will return this error code if theirsystem   has   internal   problem   and   cannot   process   the   request   andOperator logic does not require a retry of the request. Request will NOTfollow Reconciliation process"
                }
                break;
        }
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        const payLoad = {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if theirsystem   has   internal   problem   and   cannot   process   the   request   andOperator logic does not require a retry of the request. Request will NOTfollow Reconciliation process"
        }

        res.status(200).send(payLoad);
    }
}

/**
 * 
 * @author Akash Paul
 * @function handler
 * @param {*} req res
 * @returns res
 * 
 */
// ** ** this API is called from user , to Pragmatic Play provider
let getGameUrl = async (req, res) => {
    try {
        let resultarr = '';
        let bodyData = data.data;
        let mode = bodyData.mode.toLowerCase();
        let accountUserCode = bodyData.usercode;
        let token = bodyData.token;
        const accountID = data.data.account_id;
        let gameId = bodyData.game;
        let providerId = appConfig.provider_id;
        let language = (bodyData.lang) ? bodyData.lang.toLowerCase() : 'en';
        let currency = bodyData.currency.toUpperCase();
        let returnUrl = (bodyData.return_url) ? bodyData.return_url : '';

        if (mode != 'real') {
            return {
                status: false,
                code: 120,
                data: {}
            }
        }

        // ** Checking account Exist or not
        if (await commonController.isAccountExists(accountID) === false) {
            return {
                status: false,
                code: 120,
                data: {}
            }
        }

        // ** Checking client is on maintanance
        let isBetEnable = await walletController.betControlStatus(accountID, providerId);
        if ((isBetEnable.rejectionStatus == true) || (isBetEnable.maintenance_mode_status == 'Y')) {
            return {
                status: false,
                code: 120,
                data: {}
            }
        }

        //** registering or log IN the user
        const isUser = await commonController.checkUserOrRegister(accountUserCode, accountID, currency, language);
        if (isUser.error) {
            return {
                status: false,
                code: 120,
                data: {}
            }
        }
        let user = isUser.data;

        // get game details 
        let gamedtls = await commonController.getGameDetailsByGameId(gameId);
        if (checker.isEmpty(gamedtls)) {
            return {
                status: false,
                code: 120,
                data: {}
            }
        }

        if ((game_details.category_id != 1)) {
            let Status = 'Game not found!';
            code = 4009;
            return await invalidError(code, Status);
        }

        // get provider account status 
        let getProviderAccount = await commonController.checkProviderAccountLink(account_id, providerId); //get provider id first
        // if error
        if (getProviderAccount.error) {
            return {
                status: false,
                code: 120,
                data: {}
            }
        }

        // get provider account details
        let providerTechnicals = await commonController.getProviderAccountTechnicals(providerId, getProviderAccount.data);
        if (checker.isEmpty(providerTechnicals) || providerTechnicals.error) {
            return {
                status: false,
                code: 120,
                data: {}
            }
        }

        // checking that is user currency same as provider accounts currency
        let providerAccount = providerTechnicals.data;
        if (providerAccount.currency.includes(currency) === false) {
            return {
                status: false,
                code: 120,
                data: {}
            }
        }

        let gameCategory = "SLOT";
        // let session = check.createMd5hash(gameId + timeLib.currentTimeStamp());
        // token = game_details.PlayerToken;
        // let currency = user_details.currency;
        let gmCode = gamedtls.game_code;
        let terminateparams = {
            usercode: userCode,
            client_id: client_id,
            currency: currency,
            game_category: '',
            field_keys: {}
        };

        let domain = providerAccount.technical_details.api_url;
        let symbol = gmCode;
        let technology = 'H5';
        let platform = 'WEB';
        let country = 'USA';
        let cashierUrl = returnUrl;
        let lobbyUrl = returnUrl;
        let secureLogin = user._id;
        let key = providerAccount.technical_details.key;

        let posturl = domain + 'game/url';
        let urlparam = {
            cashierUrl: cashierUrl,
            country: country,
            currency: currency,
            language: language,
            lobbyUrl: lobbyUrl,
            platform: platform,
            secureLogin: secureLogin,
            stylename: secureLogin,
            symbol: symbol,
            technology: technology,
            token: token
        }

        let bodyparam = httpBuildQuery(urlparam);

        let finalstring = decodeURIComponent(bodyparam) + key;
        let hashval = check.createMd5hash(finalstring);

        console.log("finalstring ==", finalstring)

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const response = await axios.post(posturl, (bodyparam + '&hash=' + hashval), {
            headers: headers
        });

        const returnDataArr = response.data;

        if (returnDataArr && returnDataArr.error == '0') {

            const launchBaseUrl = returnDataArr.gameURL;

            let finalLaunchUrl = launchBaseUrl;

            //console.log(finalLaunchUrl);

            return {
                status: 0,
                code: "success",
                message: "Game URL has been generated!",
                data: {
                    return_url: finalLaunchUrl
                }
            }
        } else {
            return {
                status: false,
                code: 120,
                data: {}
            }
        }

    } catch (error) {
        console.log(error.message);
    }
}

/**
 * 
 * @author Akash Paul
 * @function authenticate
 * @param {*} req, res
 * @returns object
 * 
 */
let authenticate = async (req, res) => {
    try {
        const tokenStr = req.body.token;
        const hash = req.body.hash;
        const providerId = req.body.providerId;

        const tokenValid = await isTokenvalid(tokenStr);

        if (tokenValid.error > 0) {
            return tokenValid;
        }

        let splitToken = tokenStr.split("-ucd-");
        let usercode = splitToken[1];
        const userdtls = await commonController.checkUsercodeExists(usercode);
        let account_user_id = userdtls.account_user_id;
        let account_id = userdtls.account_id;

        let acountDetails = await AccountsTechnicalsModel.findOne({ account_id: account_id }).lean();
        if (checkLib.isEmpty(acountDetails)) {
            const payLoad = {
                error: 2,
                description: "Player not found or is logged out. Should be returned in the response onany request sent by Pragmatic Play if the player can’t be found or islogged out at Casino Operator’s side"
            }

            return payLoad;
        } else {
            // let config = {
            //     method: 'post',
            //     url: `${acountDetails.service_endpoint}/callback?function=authenticate`,
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     data: {
            //         user_id: userdtls.account_user_id
            //     }
            // };

            // let response = await axios(config);

            let postData = {
                user_id: userdtls.account_user_id
            }
            let response = await serverLib.server.postData(acountDetails.service_endpoint, req.params.function, postData);
            // console.log(response.response.ok)

            // checking the response has any error or not
            if (response.error == true) {
                code = 120;
                Status = "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request.";
                return await invalidError(code, Status);
            }
            let responseObj = await response.response.json();
            if (responseObj.err == true) {
                code = 120;
                Status = "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request.";
                return await invalidError(code, Status);
            }
            let responseData = responseObj.data;
            let function_name = "authenticate";
            // let responseData = await response.response.json();
            let responseCheck = await ppClientSmValidator.ppSmValidator(function_name, responseData);

            /* checking the client data format has any error or not */
            if (responseCheck.error == true) {
                let payLoad = {
                    "error": 120,
                    "description": "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
                }
                return payLoad;
            }

            let payLoad = {
                status: 200,
                userId: usercode,
                currency: userdtls.currency_code,
                cash: responseData.amount,
                bonus: 0,
                token: tokenStr,
                country: responseData.country,
                jurisdiction: responseData.jurisdiction,
                error: 0,
                description: "Success"
            }

            return payLoad;
        }
    } catch (error) {
        console.log(error.message);
        const payLoad = {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
        }

        return payLoad;
    }
}

/**
 * 
 * @author Akash Paul
 * @function balance
 * @param {*} req, res
 * @returns object
 * 
 */
let balance = async (req, res) => {
    try {
        const tokenStr = req.body.token;
        const hash = req.body.hash;

        const tokenValid = await isTokenvalid(tokenStr);

        if (tokenValid.error > 0) {
            return tokenValid;
        }

        let splitToken = tokenStr.split("-ucd-");
        let usercode = splitToken[1];
        const userdtls = await commonController.checkUsercodeExists(usercode);
        let account_user_id = userdtls.account_user_id;
        let account_id = userdtls.account_id;

        let acountDetails = await AccountsTechnicalsModel.findOne({ account_id: account_id }).lean();
        if (checkLib.isEmpty(acountDetails)) {
            const payLoad = {
                error: 2,
                description: "Player not found or is logged out. Should be returned in the response onany request sent by Pragmatic Play if the player can’t be found or islogged out at Casino Operator’s side"
            }

            return payLoad;
        }

        let postData = {
            "user_id": "1234567890"
        }
        let response = await serverLib.server.postData(acountDetails.service_endpoint, req.params.function, postData);
        // console.log(response);

        // checking the response has any error or not
        if (response.data.err == true) {
            code = 120;
            Status = "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request.";
            return await invalidError(code, Status);
        }

        let function_name = 'balance';
        let responseData = response.data;
        let responseCheck = await ppClientSmValidator.ppSmValidator(function_name, responseData);

        // checking the data format has any error or not
        if (responseCheck.error == true) {
            let payLoad = {
                "error": 120,
                "description": "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
            }
            return payLoad;
        }
        let payLoad = {
            "currency": responseData.currency,
            "cash": responseData.amount,
            "bonus": responseData.bonus,
            "error": 0,
            "description": "sucess"
        }

        return payLoad;


    } catch (error) {
        console.log(error.message);
        let payLoad = {
            "error": 120,
            "description": "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
        }

        return payLoad;
    }
}

/**
 * 
 * @author Akash Paul
 * @function bet
 * @param {*} req, res
 * @returns object
 * 
 */
let bet = async (req, res) => {
    try {
        let payLoad;
        const bodyData = req.body;
        const usercode = bodyData.userId;
        // const tokenStr = bodyData.token;
        const betamount = bodyData.amount;
        const gamecode = bodyData.gameId; // provider game ID
        // const providerId = bodyData.providerId;
        const reference_id = bodyData.reference; // provider transction ID
        const roundId = bodyData.roundId; //provider Id of the round

        // const tokenValid = await isTokenvalid(tokenStr);
        // if (check.checkObjectLen(tokenValid) > 0) {
        //     return tokenValid;
        // }

        /*** get user detail ***/
        let userdtls = await commonController.checkUsercodeExists(usercode);
        let account_user_id = userdtls.account_user_id;
        let account_id = userdtls.account_id;

        // do the hash calculation here

        //

        /* ************* Checking Bet Rejection *************** */

        let gameDetails = await GameModel.findOne({ game_provider_id: ProviderID, game_code: gamecode }).lean();
        // let providerDetails = await ProviderModel.findOne({ _id: gameDetails.game_provider_id }).lean();

        const pipeline = [
            {
                $match: {
                    _id: gameDetails.game_provider_id
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id', // Field in the "provider_table" collection
                    foreignField: 'game_provider_id', // Field in the "category_table" collection
                    as: 'categories',
                },
            },
            {
                $unwind: '$categories'
            }
        ]
        let providerDetails = await ProviderModel.aggregate(pipeline);

        let isBetEnable = await walletController.betControlStatus(account_id, providerDetails[0]._id);
        if ((isBetEnable.rejectionStatus == true) || (isBetEnable.maintenance_mode_status == 'Y')) {
            Status = 'Maintenance in progress. Try again later!';
            code = 7;
            return await invalidError(code, Status);
        }

        let acountDetails = await AccountsTechnicalsModel.findOne({ account_id: account_id }).lean();
        if (checkLib.isEmpty(acountDetails)) {
            payLoad = {
                error: 2,
                description: "Player not found or is logged out. Should be returned in the response onany request sent by Pragmatic Play if the player can’t be found or islogged out at Casino Operator’s side"
            }

            return payLoad;
        }

        let postData = {
            "user_id": "fgfdg",
            "txn_id": "12345",
            "round_id": "12345",
            "game_id": "12345",
            "category_id": "12345",
            "bet_amount": "120",
            "bonus": "10"
        }

        let response = await serverLib.server.postData(acountDetails.service_endpoint, req.params.function, postData);

        // checking the response has any error or not
        if (response.data.err == true) {
            payLoad = {
                error: 3,
                description: "Bet is not allowed. Should be returned in any case when the player is notallowed to play a specific game. For example, because of special bonus."
            }

            return payLoad;
        }

        let function_name = "bet";
        let responseData = response.data.data;
        let responseCheck = await ppClientSmValidator.ppSmValidator(function_name, responseData);

        /* checking the client data format has any error or not */
        if (responseCheck.error == true) {
            payLoad = {
                error: 3,
                description: "Bet is not allowed. Should be returned in any case when the player is notallowed to play a specific game. For example, because of special bonus."
            }

            return payLoad;
        }

        let transaction_code = responseData.code;
        switch (transaction_code) {
            case 'SUCCEED':
                // prepare data to log
                let logData = {
                    session_id: "",
                    account_id: userdtls.account_id,
                    account_user_id: userdtls.account_user_id,
                    user_id: userdtls._id,
                    game_id: gameDetails._id,
                    game_name: gameDetails.game_name.En,
                    provider_id: gameDetails.game_provider_id,
                    provider_name: providerDetails[0].game_provider_name,
                    game_category_id: gameDetails.game_category_id,
                    game_category_name: providerDetails[0].categories.category,
                    provider_transaction_id: reference_id,
                    round_id: roundId,
                    operator_transaction_id: responseData.operator_transaction_id,
                    transaction_amount: betamount,
                    transaction_type: "Debit",
                    action: "BET",
                    status: 0,
                    created_at: timeLib.currentDateTime(),
                    updated_at: timeLib.currentDateTime()
                }

                // log the data
                let inserData = await commonController.insertLog(logData);

                if (inserData.error == false) {
                    // set success response
                    payLoad = {
                        transactionId: inserData._id,
                        currency: responseData.currency,
                        cash: responseData.available_balance,
                        bonus: responseData.bonus,
                        error: 0,
                        description: "Success"
                    }
                } else {
                    payLoad = {
                        error: 120,
                        description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
                    }
                    return payLoad;
                }


                break;
            case 'BALANCE_EXCEED':
                payLoad = {
                    error: 3,
                    description: "Bet is not allowed. Should be returned in any case when the player is notallowed to play a specific game. For example, because of special bonus."
                }
                break;
            case 'ALREADY_PROCESSED':
                payLoad = {
                    error: 3,
                    description: "Bet is not allowed. Should be returned in any case when the player is notallowed to play a specific game. For example, because of special bonus."
                }
                break;
            default:
                payLoad = {
                    error: 120,
                    description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
                }

                break;
        }

        return payLoad;

    } catch (error) {
        console.log(error.message);
        const payLoad = {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
        }
        return payLoad;
    }
}

/**
 * 
 * @author Akash Paul
 * @function result
 * @param {*} req, res
 * @returns object
 * 
 */
let result = async (req, res) => {
    try {
        let payLoad;
        const bodyData = req.body;
        const usercode = bodyData.userId;
        // const tokenStr = bodyData.token;
        const winamount = bodyData.amount;
        const gamecode = bodyData.gameId; // provider game ID
        // const providerId = bodyData.providerId;
        const reference_id = bodyData.reference; // provider transction ID
        const roundId = bodyData.roundId; //provider Id of the round

        /*** get user detail ***/
        let userdtls = await commonController.checkUsercodeExists(usercode);
        let account_user_id = userdtls.account_user_id;
        let account_id = userdtls.account_id;

        // do the hash calculation here

        //

        /* ************* Checking Bet Rejection *************** */

        let gameDetails = await GameModel.findOne({ game_provider_id: ProviderID, game_code: gamecode }).lean();
        // let providerDetails = await ProviderModel.findOne({ _id: gameDetails.game_provider_id }).lean();

        const pipeline = [
            {
                $match: {
                    _id: gameDetails.game_provider_id
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id', // Field in the "provider_table" collection
                    foreignField: 'game_provider_id', // Field in the "category_table" collection
                    as: 'categories',
                },
            },
            {
                $unwind: '$categories'
            }
        ]
        let providerDetails = await ProviderModel.aggregate(pipeline);

        let isBetEnable = await walletController.betControlStatus(account_id, providerDetails[0]._id);
        if ((isBetEnable.rejectionStatus == true) || (isBetEnable.maintenance_mode_status == 'Y')) {
            Status = 'Maintenance in progress. Try again later!';
            code = 7;
            return await invalidError(code, Status);
        }

        let acountDetails = await AccountsTechnicalsModel.findOne({ account_id: account_id }).lean();
        if (checkLib.isEmpty(acountDetails)) {
            payLoad = {
                error: 2,
                description: "Player not found or is logged out. Should be returned in the response onany request sent by Pragmatic Play if the player can’t be found or islogged out at Casino Operator’s side"
            }

            return payLoad;
        }

        let postData = {
            "user_id": "fgfdg",
            "txn_id": "12345",
            "round_id": "12345",
            "game_id": "12345",
            "category_id": "12345",
            "win_amount": "120",
            "bonus": "10"
        }
        let response = await serverLib.server.postData(acountDetails.service_endpoint, req.params.function, postData);

        // checking the response has any error or not
        if (response.data.err == true) {
            payLoad = {
                error: 120,
                description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
            }
            return payLoad;
        }

        let function_name = "bet";
        let responseData = response.data.data;
        let responseCheck = await ppClientSmValidator.ppSmValidator(function_name, responseData);

        /* checking the client data format has any error or not */
        if (responseCheck.error == true) {
            payLoad = {
                error: 120,
                description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
            }
            return payLoad;
        }

        let transaction_code = responseData.code;
        switch (transaction_code) {
            case 'SUCCEED':
                // prepare data to log
                let logData = {
                    session_id: "",
                    account_id: userdtls.account_id,
                    account_user_id: userdtls.account_user_id,
                    user_id: userdtls._id,
                    game_id: gameDetails._id,
                    game_name: gameDetails.game_name.En,
                    provider_id: gameDetails.game_provider_id,
                    provider_name: providerDetails[0].game_provider_name,
                    game_category_id: gameDetails.game_category_id,
                    game_category_name: providerDetails[0].categories.category,
                    provider_transaction_id: reference_id,
                    round_id: roundId,
                    operator_transaction_id: responseData.operator_transaction_id,
                    transaction_amount: winamount,
                    transaction_type: "Credit",
                    action: "WIN",
                    status: 0,
                    created_at: timeLib.currentDateTime(),
                    updated_at: timeLib.currentDateTime()
                }

                // log the data
                let inserData = await commonController.insertLog(logData);

                if (inserData.error == false) {
                    // set success response
                    payLoad = {
                        transactionId: inserData._id,
                        currency: responseData.currency,
                        cash: responseData.available_balance,
                        bonus: responseData.bonus,
                        error: 0,
                        description: "Success"
                    }
                } else {
                    payLoad = {
                        error: 120,
                        description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
                    }
                    return payLoad;
                }


                break;
            case 'BALANCE_EXCEED':
                payLoad = {
                    error: 120,
                    description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
                }
                break;
            case 'ALREADY_PROCESSED':
                payLoad = {
                    error: 3,
                    description: "Bet is not allowed. Should be returned in any case when the player is notallowed to play a specific game. For example, because of special bonus."
                }
                break;
            default:
                payLoad = {
                    error: 120,
                    description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
                }

                break;
        }

        return payLoad;

    } catch (error) {
        console.log(error.message);
        const payLoad = {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
        }
        return payLoad;
    }
}

/**
 * 
 * @author Akash Paul
 * @function result
 * @param {*} req, res
 * @returns object
 * 
 */
let refund = async (req, res) => {
    try {
        let payLoad;
        const bodyData = data.data;
        const usercode = bodyData.userId;
        // const tokenStr = bodyData.token;
        // const winamount = bodyData.amount;
        // const gamecode = bodyData.gameId;
        const reference_id = bodyData.reference;
        // const roundId = bodyData.roundId;

        // const tokenValid = await isTokenvalid(tokenStr);
        // if (check.checkObjectLen(tokenValid) > 0) {
        //     return tokenValid;
        // }

        /*** get user detail ***/
        let userdtls = await commonController.checkUsercodeExists(usercode);
        let account_user_id = userdtls.account_user_id;
        let account_id = userdtls.account_id;

        // do the hash calculation here

        //

        // let gameDetails = GameModel.findOne({ game_code: gamecode }).lean();
        // let providerDetails = ProviderModel.findOne({ _id: gameDetails.game_provider_id }).lean();

        let transctionDetails = await TransactionModel.findOne({ provider_transaction_id: reference_id }).lean();
        if (checkLib.isEmpty(transctionDetails)) {
            payLoad = {
                error: 120,
                description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
            }
            return payLoad;
        }

        let acountDetails = await AccountsTechnicalsModel.findOne({ account_id: account_id }).lean();
        if (checkLib.isEmpty(acountDetails)) {
            payLoad = {
                error: 2,
                description: "Player not found or is logged out. Should be returned in the response onany request sent by Pragmatic Play if the player can’t be found or islogged out at Casino Operator’s side"
            }
            return payLoad;
        }

        postData = {
            "txn_id": `${reference_id}`,
        }

        let response = await serverLib.server.postData(acountDetails.service_endpoint, req.params.function, postData);

        let function_name = "refund";
        let responseData = response.data;
        let responseCheck = await ppClientSmValidator.ppSmValidator(function_name, responseData);

        /* checking the client data format has any error or not */
        if (responseCheck.error == true) {
            payLoad = {
                "error": 1,
                "description": "error"
            }
            return payLoad;
        }

        let transaction_code = responseData.operator_transaction_id == null ? "FAILED" : "SUCCEED";

        switch (transaction_code) {
            case 'SUCCEED':
                // prepare data to log
                let logData = {
                    session_id: "",
                    account_id: transctionDetails.account_id,
                    account_user_id: transctionDetails.account_user_id,
                    user_id: transctionDetails.user_id,
                    game_id: transctionDetails.game_id,
                    game_name: transctionDetails.game_name,
                    provider_id: transctionDetails.provider_id,
                    provider_name: transctionDetails.provider_name,
                    game_category_id: transctionDetails.game_category_id,
                    game_category_name: transctionDetails.game_category_name,
                    provider_transaction_id: transctionDetails.provider_transaction_id,
                    round_id: transctionDetails.round_id,
                    operator_transaction_id: responseData.operator_transaction_id,
                    transaction_amount: transctionDetails.transaction_amount,
                    transaction_type: "Credit",
                    action: "Rollback",
                    status: 0,
                    created_at: timeLib.currentDateTime(),
                    updated_at: timeLib.currentDateTime()
                }

                // log the data
                let inserData = await commonController.insertLog(logData);

                if (inserData.error == false) {
                    // set success response
                    payLoad = {
                        transactionId: inserData._id,
                        currency: responseData.currency,
                        cash: responseData.available_balance,
                        bonus: responseData.bonus,
                        error: 0,
                        description: "Success"
                    }
                } else {
                    payLoad = {
                        error: 120,
                        description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
                    }
                    return payLoad;
                }
                break;
            default:
                payLoad = {
                    error: 120,
                    description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
                }

                break;
        }

    } catch (error) {
        console.log(error.message);
        const payLoad = {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
        }
        return payLoad;
    }
}


/*************************************************************************************************/ /* This is the required functions for API's */

/**
 * 
 * @author Akash Paul
 * @function isTokenvalid
 * @param {*} tokenStr
 * @returns object
 * 
 */
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

/**
 * 
 * @author Akash Paul
 * @function invalidError
 * @param {*} errocode, description
 * @returns object
 * 
 */
let invalidError = async (errocode, description) => {
    return {
        error: errocode,
        description: description
    }
}

module.exports = {
    handler: handler
}



