/**
 * 
 * @author Rajdeep Adhikary
 * @purpose Boongo provider integration and game launch related works
 * @createdDate Sep 26 2023
 * @lastUpdated Oct 11 2023
 * @lastUpdatedBy Rajdeep Adhikary
 */

/** Modules Import */
let axios = require('axios');
let clientValidator = require('../middlewares/validators/clientValidator');
const mongoose = require('mongoose');
const AccountsTechnicalsModel = mongoose.model('AccountsTechnicals');
const commonController = require('../controllers/commonController'); 
const checker = require('../libs/checkLib');
const time = require('../libs/timeLib');
const redis = require('../libs/redisLib');
const appConfig = require('../../config/appConfig');
let apiService = appConfig.apiService;

/**
 * 
 * @author Rajdeep Adhikary
 * @function handler
 * @param {*} req res
 * @returns res
 * 
 */
const handler  = async(req, res) => {
    try{
        let response;
        switch (req.body.name) {
            case "login":
                response = await login(req.body);
                break;
            case "getbalance":
                response = await getbalance(req.body);
                break;
            case "transaction":
                response = await transaction(req.body);
                break;
            case "rollback":
                response = await rollback(req.body);
                break;
            default:
                response = {}
                break;
        }
        res.status(200).json(response);

    }
    catch(error){
        console.error(error);
        return error;
    }
}


/**
 * 
 * @author Rajdeep Adhikary
 * @function login
 * @param {*} data 
 * @returns object
 * 
 */

const login = async(data) => {
    try {
        let uid = data.uid;
        const mode = "REAL";
        let playerToken = data.token.split("-ucd-");
        let usercode = playerToken[1];
        const userdtls = await commonController.checkUsercodeExists(usercode);
        let acountDetails = await AccountsTechnicalsModel.findOne({account_id: userdtls.account_id }).lean();

        if(checker.isEmpty(acountDetails)){
            return {
                "uid": data.uid,            
                "error": {
                    "code": "INVALID_TOKEN"  
                }
            }
        }
        else{

            let dataToSend = {
                user_id : userdtls.account_user_id                       // YMDJD12
            }

            // let response = await apiLib.server.postData(acountDetails.service_endpoint, 'authenticate', dataToSend);
            // response = await response.response.json();

            let url = `${acountDetails.service_endpoint}/callback?function=authenticate`;

            let config = {
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            }
            let response = await apiService.call(url, config);
            
            if(response.error === true){
                return {
                    "uid": data.uid,            
                    "error": {
                        "code": "FATAL_ERROR" 
                    }
                }
            }

            response = await response.response.json();

            let validation = await clientValidator.validateResponse(response.data, 'login');

    
            if(validation.error === false){
                let user_balance = response.data.amount;
                let version = await commonController.getVersion();
                let currency = response.data.currency;
    
                return {
                    uid: uid,
                    player: {
                        id: usercode,
                        currency: currency,
                        mode: mode,
                        is_test: false,
                    },
                    balance: {
                        value: parseFloat(user_balance).toFixed(2).toString(),
                        version: version
                    },
                    tag: ''
                }
            }
            else{
                return {
                    "uid": data.uid,            
                    "error": {
                        "code": "INVALID_TOKEN"  
                    }
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        return {
            uid: data.uid,
            error: {
              code: 'INVALID_TOKEN'
            }
          }
    }
}
/**
 * 
 * @author Rajdeep Adhikary
 * @function getBalance
 * @param {*} data 
 * @returns object
 * 
 */
const getbalance = async(data) => {
    try {
        let playerToken = data.token.split("-ucd-");
        let usercode = playerToken[1];
        const userdtls = await commonController.checkUsercodeExists(usercode);
        let acountDetails = await AccountsTechnicalsModel.findOne({account_id: userdtls.account_id }).lean();

        if(checker.isEmpty(acountDetails)){
            return {
                "uid": data.uid,            
                "error": {
                    "code": "INVALID_TOKEN"  
                }
            }
        }
        else{

            let dataToSend = {
                user_id : userdtls.account_user_id
            }

            // let response = await apiLib.server.postData(acountDetails.service_endpoint, 'balance', dataToSend);
            // response = await response.response.json();
            let url = `${acountDetails.service_endpoint}/callback?function=balance`;

            let config = {
                method: "POST",
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            }
            let response = await apiService.call(url, config);
            
            if(response.error === true){
                return {
                    "uid": data.uid,            
                    "error": {
                        "code": "FATAL_ERROR" 
                    }
                }
            }

            response = await response.response.json();

            let version = await commonController.getVersion();

            let validation = await clientValidator.validateResponse(response.data, 'balance');

            if(validation.error === false){
                return {
                    "uid": data.uid,
                    "balance": {
                        "value": parseFloat(response.data.amount.toFixed(2)).toString(),
                        "version": version
                    }
                }
            }
            else{
                console.log('client response validation error');
                console.log(validation);
                return {
                    "uid": data.uid,            
                    "error": {
                        "code": "INVALID_TOKEN"  
                    }
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        return {
            "uid": data.uid,            
            "error": {
                "code": "INVALID_TOKEN"  
            }
        }
    }
}

/**
 * 
 * @author Rajdeep Adhikary
 * @function transaction
 * @param {*} data 
 * @returns object
 * 
 */

const transaction = async(data) => {
    try {
        let playerToken = data.token.split("-ucd-");
        let usercode = playerToken[1];
        const userdtls = await commonController.checkUsercodeExists(usercode);
        let provider_id = appConfig.provider_id;
        let transaction_type = amount = '';
        let transaction_id = data.uid;
        // check if bet is allowed
        let betStatus = await commonController.isBetEnabled(userdtls.account_id, provider_id);
        if(betStatus.rejectionStatus === true || betStatus.maintenance_mode_status === 'Y'){
            returnData =  {
                "uid": data.uid,            
                "error": {
                    "code": "SESSION_CLOSED"  
                }
            }
        }
        let gamedtls = await commonController.getGameDetailsByGameCode(data.game_id, provider_id);
        let bet = (data.args && data.args.bet) ? data.args.bet : '';
        let win = (data.args && data.args.win) ? data.args.win : '';
        let roundId = data.args.round_id;
        if(bet.trim() !== ''){

            transaction_type = 'DEBIT';
            amount = bet;

            // prepare data to send to client
            let dataToSend = {
                txn_id : transaction_id,
                round_id : roundId.toString(),
                bet_amount : amount,
                game_id : gamedtls._id,
                category_id : gamedtls.game_category_id,
                user_id : userdtls.account_user_id
            }

            let acountDetails = await AccountsTechnicalsModel.findOne({account_id: userdtls.account_id }).lean();

            if(checker.isEmpty(acountDetails)){
                returnData =  {
                    "uid": data.uid,            
                    "error": {
                        "code": "INVALID_TOKEN"  
                    }
                }
            }
            else{

                // let response = await apiLib.server.postData(acountDetails.service_endpoint, 'bet', dataToSend);
                // response = await response.response.json();
                let beturl = `${acountDetails.service_endpoint}/callback?function=bet`;

                let config = {
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend)
                }

                let response = await apiService.call(beturl, config);
            
                if(response.error === true){
                    return {
                        "uid": data.uid,            
                        "error": {
                            "code": "FATAL_ERROR" 
                        }
                    }
                }

                response = await response.response.json();

                let validation = await clientValidator.validateResponse(response.data, 'bet');

                if(validation.error === true){
                    returnData = {
                        "uid": data.uid,            
                        "error": {
                            "code": "INVALID_TOKEN"  
                        }
                    }
                }
                else{
                    let transaction_code = response.message;
                    switch (transaction_code) {
                        case 'SUCCESS':
                            // prepare data to log
                            let logData = {
                                session_id : "",
                                account_id : userdtls.account_id,
                                account_user_id : userdtls.account_user_id,
                                user_id : userdtls._id,
                                game_id : gamedtls._id,
                                game_name : gamedtls.game_name.en,
                                provider_id : provider_id,
                                provider_name : data.provider_name,
                                game_category_id : gamedtls.game_category_id,
                                game_category_name : gamedtls.categorydtls.category_name.en,
                                provider_transaction_id : transaction_id,
                                round_id : roundId,
                                operator_transaction_id : response.data.operator_transaction_id,
                                available_balance : response.data.available_balance,
                                transaction_amount : amount,
                                transaction_type : transaction_type,
                                action : 'BET',
                                status : 0,
                                created_at : time.now(),
                                updated_at : time.now()
                            }
                            
                            // log the data
                            console.log('transaction saved :');
                            console.log(await commonController.insertLog(logData));

                            // set success response
                            returnData = {
                                uid: data.uid,
                                balance: {
                                    value: (response.data.available_balance).toFixed(2),
                                    version: await commonController.getVersion(),
                                    
                                }
                            }
                            break;
                        case 'BALANCE_EXCEED':
                            // returnData = {
                            //     "uid": data.uid,            
                            //     "error": {
                            //         "code": "FUNDS_EXCEED"  
                            //     }
                            // }
                            let balance = await getbalance({ token : data.token });
                            balance.uid = data.uid;
                            balance.error = {
                                "code": "FUNDS_EXCEED"  
                            }
                            return balance;
                            break;
                        case 'ALREADY_PROCESSED':
                            returnData = {
                                uid: data.uid,
                                balance: {
                                    value: (response.data.available_balance).toFixed(2).toString(),
                                    version: await commonController.getVersion(),
                                    
                                }
                            }
                            break;
                        default:
                            returnData = {
                                "uid": data.uid,            
                                "error": {
                                    "code": "INVALID_TOKEN"  
                                }
                            }
                            break;
                    }
                }
            }
        }
        if(win.trim() !== ''){

            transaction_type = 'CREDIT';
            amount = win;

            // prepare data to send to client
            let dataToSend = {
                txn_id : transaction_id,
                round_id : roundId.toString(),
                win_amount : amount,
                game_id : gamedtls._id,
                category_id : gamedtls.game_category_id,
                user_id : userdtls.account_user_id
            }

            let acountDetails = await AccountsTechnicalsModel.findOne({account_id: userdtls.account_id }).lean();

            if(checker.isEmpty(acountDetails)){
                returnData =  {
                    "uid": data.uid,            
                    "error": {
                        "code": "INVALID_TOKEN"  
                    }
                }
            }
            else{

                // let response = await apiLib.server.postData(acountDetails.service_endpoint, 'win', dataToSend);
                // response = await response.response.json();
                let winurl = `${acountDetails.service_endpoint}/callback?function=win`;

                let config = {
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend)
                }
                let response = await apiService.call(winurl, config);
            
                if(response.error === true){
                    return {
                        "uid": data.uid,            
                        "error": {
                            "code": "FATAL_ERROR" 
                        }
                    }
                }

                response = await response.response.json();
                console.log(response);

                let validation = await clientValidator.validateResponse(response.data, 'win');

                if(validation.error === true){
                    returnData = {
                        "uid": data.uid,            
                        "error": {
                            "code": "INVALID_TOKEN"  
                        }
                    }
                }
                else{
                    let transaction_code = response.message;
                    switch (transaction_code) {
                        case 'SUCCESS':
                            // prepare data to log
                            let logData = {
                                session_id : "",
                                account_id : userdtls.account_id,
                                account_user_id : userdtls.account_user_id,
                                user_id : userdtls._id,
                                game_id : gamedtls._id,
                                game_name : gamedtls.game_name.en,
                                provider_id : provider_id,
                                provider_name : data.provider_name,
                                game_category_id : gamedtls.game_category_id,
                                game_category_name : gamedtls.categorydtls.category_name.en,
                                provider_transaction_id : transaction_id,
                                round_id : roundId,
                                operator_transaction_id : response.data.operator_transaction_id,
                                available_balance : response.data.available_balance,
                                transaction_amount : amount,
                                transaction_type : transaction_type,
                                action : 'WIN',
                                status : 0,
                                created_at : time.now(),
                                updated_at : time.now()
                            }
                            
                            // log the data
                            console.log('transaction saved :');
                            console.log(await commonController.insertLog(logData));

                            // set success response
                            returnData = {
                                uid: data.uid,
                                balance: {
                                    value: (response.data.available_balance).toFixed(2),
                                    version: await commonController.getVersion(),
                                    
                                }
                            }
                            break;
                        case 'ALREADY_PROCESSED':
                            returnData = {
                                uid: data.uid,
                                balance: {
                                    value: (response.data.available_balance).toFixed(2).toString(),
                                    version: await commonController.getVersion(),
                                    
                                }
                            }
                            break;
                        default:
                            returnData = {
                                "uid": data.uid,            
                                "error": {
                                    "code": "INVALID_TOKEN"  
                                }
                            }
                            break;
                    }
                }
            }
        }
        return returnData;

    } catch (error) {
        console.log(error.message);
        return {
            "uid": data.uid,            
            "error": {
                "code": "INVALID_TOKEN"  
            }
        }
    }
}



/**
 * 
 * @author Rajdeep Adhikary
 * @function rollback
 * @param {*} data 
 * @returns object
 * 
 */

const rollback = async(data) => {
    try {

        let playerToken = data.token.split("-ucd-");
        let usercode = playerToken[1];
        const userdtls = await commonController.checkUsercodeExists(usercode);
        let provider_id = appConfig.provider_id;
        let transaction_type = 'CREDIT';
        let transaction_id = data.uid;
        let gamedtls = await commonController.getGameDetailsByGameCode(data.game_id, provider_id);
        let referenced_transaction_id = data.args.transaction_uid;
        let roundId = data.args.round_id;

        // check transaction
        let transactionValid = await commonController.isTransactionValid(referenced_transaction_id);
        if (!transactionValid) {
            console.log('invalid transaction');
            let balance = await getbalance({ token : data.token });
            balance.uid = data.uid;
            return balance;
        }
        else{
            
            let acountDetails = await AccountsTechnicalsModel.findOne({ account_id: userdtls.account_id }).lean();

            if(checker.isEmpty(acountDetails)){
                return {
                    "uid": data.uid,            
                    "error": {
                        "code": "INVALID_TOKEN"  
                    }
                }
            }
            else{

                let dataToSend = {
                    txn_id : referenced_transaction_id,
                    user_id : userdtls.account_user_id
                }

                // let response = await apiLib.server.postData(acountDetails.service_endpoint, 'refund', dataToSend);
                // response = await response.response.json();
                // console.log(response);
                let url = `${acountDetails.service_endpoint}/callback?function=refund`;

                let config = {
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataToSend)
                }
                let response = await apiService.call(url, config);
            
                if(response.error === true){
                    return {
                        "uid": data.uid,            
                        "error": {
                            "code": "FATAL_ERROR" 
                        }
                    }
                }

                response = await response.response.json();

                let validation = await clientValidator.validateResponse(response.data, 'rollback');

                if(validation.error === true){
                    return {
                        "uid": data.uid,            
                        "error": {
                            "code": "INVALID_TOKEN"  
                        }
                    }
                }
                else{
                    let operator_transaction_id = response.data.operator_transaction_id;

                    if (operator_transaction_id !== null) {

                        let logData = {
                            session_id : "",
                            account_id : userdtls.account_id,
                            account_user_id : userdtls.account_user_id,
                            user_id : userdtls._id,
                            game_id : gamedtls._id,
                            game_name : gamedtls.game_name.en,
                            provider_id : provider_id,
                            provider_name : data.provider_name,
                            game_category_id : gamedtls.game_category_id,
                            game_category_name : gamedtls.categorydtls.category_name.en,
                            provider_transaction_id : transaction_id,
                            round_id : roundId,
                            operator_transaction_id : operator_transaction_id,
                            transaction_amount : transactionValid.transaction_amount,
                            available_balance : response.data.available_balance,
                            transaction_type : transaction_type,
                            action : 'ROLLBACK',
                            status : 0,
                            created_at : time.now(),
                            updated_at : time.now()
                        }

                        // log the data
                        console.log('transaction saved :');
                        console.log(await commonController.insertLog(logData));

                        // set success response
                        return {
                            uid: data.uid,
                            balance: {
                                value: (response.data.available_balance).toFixed(2).toString(),
                                version: await commonController.getVersion(),
                            }
                        }
                    }
                    else{
                        return {
                            "uid": data.uid,            
                            "error": {
                                "code": "INVALID_TOKEN"  
                            }
                        }
                    }
                }
            }
        }

        

    } catch (error) {
        console.log(error.message);
        return {
            "uid": data.uid,            
            "error": {
                "code": "INVALID_TOKEN"  
            }
        }
    }
}

/**
 * 
 * @author Rajdeep Adhikary
 * @function getGameUrl
 * @param {*} data 
 * @returns object
 * 
 */

const getGameUrl = async(req, res) => {
    try {
        const data = req.body;
        const userCode = data.usercode;
        const token = data.token;
        const language = data.language.toLowerCase();
        const gm_title = 'Boongo Game';
        const wl = "prod";
        const account_id = data.account_id;
        const currency = data.currency.toUpperCase();
        const game_id = data.game_id;

        let provider_id = appConfig.provider_id;

        if(await commonController.isAccountExists(account_id) === false){
            res.status(200).send({
                code: 1001,                                         // Invalid Account Id
                message: "INVALID_ACCOUNT",
                data: {}
            })
            return;
        }

        let betStatus = await commonController.isBetEnabled(account_id, provider_id);
        if(betStatus.rejectionStatus === true){
            res.status(200).send({
                code: 1002,                                         // Provider and client not mapped
                message: "PROVIDER_DENIED",
                data: {}
            })
            return;
        }

        if(betStatus.maintenance_mode_status === 'Y'){
            res.status(200).send({
                code: 1003,                                         // client maintainance mode on
                message: "MAINTENANCE_MODE_ON",
                data: {}
            })
            return;
        }

        const isUser = await commonController.checkUserExistsOrRegister(userCode, account_id, currency, language);
        if(isUser.error){
            res.status(200).send({
                code: 1004,                                         // Invalid user or unable to save user
                message: "FATAL_ERROR",
                data: {}
            })
            return;
        }
        let user = isUser.data;

        let gamedtls = await commonController.getGameDetailsByGameId(game_id);

        if(checker.isEmpty(gamedtls)){
            res.status(200).send({
                code: 1005,                                         //invalid game id
                message: "GAME_NOT_FOUND",
                data: {}
            })
            return;
        }

        let getProviderAccount = await commonController.checkProviderAccountLink(account_id, provider_id); //get provider id first

        if(getProviderAccount.error){
            res.status(200).send({
                code: 1004,                                         // account id not mapped with any provider account & unable to retrieve default provider account
                message: "FATAL_ERROR",
                data: {}
            })
            return;
        }

        let providerAccountId = getProviderAccount.data;

        let providerTechnicals = await commonController.getProviderAccountTechnicals(providerAccountId);
        
        if(providerTechnicals.error === true){
            res.status(200).send({
                code: 1004,                                         // unable to get provider account details from redis
                message: "FATAL_ERROR",
                data: {}
            })
            return;
        }

        providerTechnicals = providerTechnicals.data;

        if(providerTechnicals.currency.includes(currency) === false){
            res.status(200).send({
                code: 1006,                                         // currency not supported by provider
                message: "INVALID_CURRENCY",
                data: {}
            })
            return;
        }

        let game_url = providerTechnicals.technical_details.game_url;

        await redis.addWithTtl(`user-${user._id}-game-${game_id}`, token, appConfig.sessionExpTime);

        let newToken = `${token}-ucd-${user._id}`;
        let gmCode = gamedtls.game_code;

        const params = {
            "wl": wl,
            "token": newToken,
            "game": gmCode,
            "lang": language,
            "sound": "1",
            "ts": new Date().getTime(),
            "title": gm_title
        };

        if((data.hasOwnProperty('return_url')) && (data.return_url !== null || data.return_url !== undefined)){
            params.exit_url = data.return_url;
            params.cashier_url = data.return_url;
        }

        let query = "";

        for (let key in params) {
            query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
        }
        query = query.slice(0, -1); // Remove the last "&"

        let finalLaunchUrl = game_url + "?" + query;

        res.status(200).send({
            code: 1000,                                    // currency not supported by provider
            message: "SUCCESS",
            data: {
                game_url: finalLaunchUrl
            }
        })
        return;
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            code: 1004,                                  // unable to get provider account details from redis
            message: "FATAL_ERROR",
            data: {}
        });
        return;
    }
}

module.exports = {
    handler: handler ,
    getGameUrl: getGameUrl,
};