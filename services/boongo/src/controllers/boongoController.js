/**
 * 
 * @author Rajdeep Adhikary
 * @purpose Boongo provider integration and game launch related works
 * @createdDate Sep 26 2023
 * @lastUpdated Sep 26 2023
 * @lastUpdatedBy Rajdeep Adhikary
 */

/** Modules Import */
let axios = require('axios');
let clientValidator = require('../middlewares/validators/clientValidator');
const mongoose = require('mongoose');
const AccountsTechnicalsModel = mongoose.model('AccountsTechnicals');
const commonController = require('../controllers/commonController'); 
const checker = require('../libs/checkLib');
const { moment } = require('moment-timezone');

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
            case "getGameUrl":
                response = await getGameUrl(req.body);
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
                    "code": "FATAL_ERROR"  
                }
            }
        }
        else{
            let config = {
                method: 'post',
                url: `${acountDetails.service_endpoint}/callback?function=authenticate`,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    user_id : userdtls.account_user_id                       // YMDJD12
                }
            };
    
            let response = await axios(config);
    
            let validation = await clientValidator.validateResponse(response.data.data, 'login');
    
            if(validation.error === false){
                let user_balance = response.data.data.cash;
                let version = await commonController.getVersion();
                let currency = response.data.data.currency;
    
                return {
                    uid: uid,
                    player: {
                    id: usercode,
                    currency: currency,
                    mode: mode,
                    is_test: false,
                    },
                    balance: {
                    value: parseFloat(user_balance).toFixed(2),
                    version: version
                    },
                    tag: ''
                }
            }
            else{
                return {
                    "uid": data.uid,            
                    "error": {
                        "code": "FATAL_ERROR"  
                    }
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        return {
            uid: data.uid,
            error: {
              code: 'FATAL_ERROR'
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
    // const serverStartTime = new Date();
    try {
        let playerToken = data.token.split("-ucd-");
        let usercode = playerToken[1];
        const userdtls = await commonController.checkUsercodeExists(usercode);
        let acountDetails = await AccountsTechnicalsModel.findOne({account_id: userdtls.account_id }).lean();
        // const walletStartTime = new Date();

        if(checker.isEmpty(acountDetails)){
            return {
                "uid": data.uid,            
                "error": {
                    "code": "FATAL_ERROR"  
                }
            }
        }
        else{

            let config = {
                method: 'post',
                url: `${acountDetails.service_endpoint}/callback?function=balance`,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    user_id : 'yudn2mak3lsmj0kgkdmd91'
                }
            };

            let response = await axios(config);
            // console.log(response)
            // const walletEndTime = new Date();
            // const walletTimeDifference = walletEndTime - walletStartTime;

            let version = Math.floor(Date.now() / 1000);

            let validation = await clientValidator.validateResponse(response.data.data, 'balance');

            if(validation.error === false){
                return {
                    "uid": data.uid,
                    "balance": {
                        "value": parseFloat(response.data.data.cash.toFixed(2)),
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
                        "code": "FATAL_ERROR"  
                    }
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        return {
            "uid": data.uid,            
            "error": {
                "code": "FATAL_ERROR"  
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
        let provider_id = data.provider_id;
        let transaction_type = returnData = amount = '';
        let transaction_id = data.uid;
        // check if bet is allowed
        let betStatus = await commonController.isBetEnabled(userdtls.account_id, provider_id);
        if(betStatus.rejectionStatus === false || betStatus.maintenance_mode_status === 'Y'){
            returnData =  {
                "uid": data.uid,            
                "error": {
                    "code": "SESSION_CLOSED"  
                }
            }
        }
        let gamedtls = await commonController.getGameDetailsByGameCode(data.game_id, data.provider_id);
        let bet = (bodyData.args && bodyData.args.bet) ? bodyData.args.bet : '';
        let win = (bodyData.args && bodyData.args.win) ? bodyData.args.win : '';
        let roundId = data.args.round_id;
        if(bet.trim() !== ''){

            transaction_type = 'DEBIT';

            // prepare data to send to client
            let dataToSend = {
                txn_id : transaction_id,
                round_id : roundId,
                bet_amount : amount,
                game_id : gamedtls.game_id,
                category_id : gamedtls.game_category_id,
                bonus : '',
                user_id : account_user_id
            }

            let acountDetails = await AccountsTechnicalsModel.findOne({account_id: userdtls.account_id }).lean();

            if(checker.isEmpty(acountDetails)){
                returnData =  {
                    "uid": data.uid,            
                    "error": {
                        "code": "FATAL_ERROR"  
                    }
                }
            }
            else{

                let config = {
                    method: 'post',
                    url: `${acountDetails.service_endpoint}/callback?function=bet`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: dataToSend
                };

                let response = await axios(config);

                let validation = await clientValidator.validateResponse(response.data.data, 'bet');

                if(validation.error === true){
                    returnData =  {
                        "uid": data.uid,            
                        "error": {
                            "code": "FATAL_ERROR"  
                        }
                    }
                }
                else{
                    let transaction_code = response.data.data.code;
                    switch (transaction_code) {
                        case 'SUCCEED':
                            // prepare data to log
                            let logData = {
                                session_id : null,
                                account_id : userdtls.account_id,
                                account_user_id : userdtls.account_user_id,
                                user_id : userdtls._id,
                                game_id : gamedtls.game_id,
                                game_name : gamedtls.game_name,
                                provider_id : data.provider_id,
                                provider_name : data.provider_name,
                                game_category_id : gamedtls.game_category_id,
                                game_category_name : gamedtls.game_category_name,
                                provider_transaction_id : transaction_id,
                                roundID : roundId,
                                operator_transaction_id : response.data.data.operator_transaction_id,
                                transaction_amount : amount,
                                transaction_type : transaction_type,
                                status : 0,
                                created_at : moment().toISOString(),
                                updated_at : moment().toISOString()
                            }
                            
                            // log the data
                            await commonController.insertLog(logData);

                            // set success response
                            returnData = {
                                uid: data.uid,
                                balance: {
                                    value: (response.data.data.bet_amount).toFixed(2),
                                    version: await commonController.getVersion(),
                                    code: 3
                                }
                            }
                            break;
                        case 'BALANCE_EXCEED':
                            returnData =  {
                                "uid": data.uid,            
                                "error": {
                                    "code": "FUNDS_EXCEED"  
                                }
                            }
                            break;
                        case 'ALREADY_PROCESSED':
                            returnData =  {
                                "uid": data.uid,            
                                "error": {
                                    "code": "FUNDS_EXCEED"  
                                }
                            }
                            break;
                        default:
                            returnData =  {
                                "uid": data.uid,            
                                "error": {
                                    "code": "FATAL_ERROR"  
                                }
                            }
                            break;
                    }
                }
            }
        }
        if(win.trim() !== ''){

            transaction_type = 'CREDIT';

            // prepare data to send to client
            let dataToSend = {
                txn_id : transaction_id,
                round_id : roundId,
                win_amount : amount,
                game_id : gamedtls.game_id,
                category_id : gamedtls.game_category_id,
                bonus : '',
                user_id : account_user_id
            }

            let acountDetails = await AccountsTechnicalsModel.findOne({account_id: userdtls.account_id }).lean();

            if(checker.isEmpty(acountDetails)){
                returnData =  {
                    "uid": data.uid,            
                    "error": {
                        "code": "FATAL_ERROR"  
                    }
                }
            }
            else{

                let config = {
                    method: 'post',
                    url: `${acountDetails.service_endpoint}/callback?function=win`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: dataToSend
                };

                let response = await axios(config);

                let validation = await clientValidator.validateResponse(response.data.data, 'win');

                if(validation.error === true){
                    returnData =  {
                        "uid": data.uid,            
                        "error": {
                            "code": "FATAL_ERROR"  
                        }
                    }
                }
                else{
                    let transaction_code = response.data.data.code;
                    switch (transaction_code) {
                        case 'SUCCEED':
                            // prepare data to log
                            let logData = {
                                session_id : null,
                                account_id : userdtls.account_id,
                                account_user_id : userdtls.account_user_id,
                                user_id : userdtls._id,
                                game_id : gamedtls.game_id,
                                game_name : gamedtls.game_name,
                                provider_id : data.provider_id,
                                provider_name : data.provider_name,
                                game_category_id : gamedtls.game_category_id,
                                game_category_name : gamedtls.game_category_name,
                                provider_transaction_id : transaction_id,
                                roundID : roundId,
                                operator_transaction_id : response.data.data.operator_transaction_id,
                                transaction_amount : amount,
                                transaction_type : transaction_type,
                                status : 0,
                                created_at : moment().toISOString(),
                                updated_at : moment().toISOString()
                            }
                            
                            // log the data
                            await commonController.insertLog(logData);

                            // set success response
                            returnData = {
                                uid: data.uid,
                                balance: {
                                    value: (response.data.data.win_amount).toFixed(2),
                                    version: await commonController.getVersion(),
                                    code: 3
                                }
                            }
                            break;
                        case 'BALANCE_EXCEED':
                            returnData =  {
                                "uid": data.uid,            
                                "error": {
                                    "code": "FUNDS_EXCEED"  
                                }
                            }
                            break;
                        case 'ALREADY_PROCESSED':
                            returnData =  {
                                "uid": data.uid,            
                                "error": {
                                    "code": "FUNDS_EXCEED"  
                                }
                            }
                            break;
                        default:
                            returnData =  {
                                "uid": data.uid,            
                                "error": {
                                    "code": "FATAL_ERROR"  
                                }
                            }
                            break;
                    }
                }
            }
        }
        return returnData;

    } catch (error) {
        return {
            "uid": data.uid,            
            "error": {
                "code": "FATAL_ERROR"  
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

const rollback = async(req, res) => {
    
}

module.exports = {
    handler: handler ,
};