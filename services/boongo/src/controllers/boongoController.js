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
const time = require('../libs/timeLib');
const { invalid } = require('joi');

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
        let provider_id = "65142a47b0aef485da243a29";
        let transaction_type = amount = '';
        let transaction_id = data.uid;
        // check if bet is allowed
        let betStatus = await commonController.isBetEnabled(userdtls.account_id, provider_id);
        if(betStatus.rejectionStatus === true || betStatus.maintenance_mode_status === 'Y'){
            return {
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
                bonus : '',
                user_id : userdtls.account_user_id
            }

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
                    url: `${acountDetails.service_endpoint}/callback?function=bet`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: dataToSend
                };

                let response = await axios(config);

                let validation = await clientValidator.validateResponse(response.data.data, 'bet');

                if(validation.error === true){
                    return {
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
                                session_id : "",
                                account_id : userdtls.account_id,
                                account_user_id : userdtls.account_user_id,
                                user_id : userdtls._id,
                                game_id : gamedtls._id,
                                game_name : gamedtls.game_name.en,
                                provider_id : provider_id,
                                provider_name : data.provider_name,
                                game_category_id : gamedtls.game_category_id,
                                game_category_name : gamedtls.categorydtls.category,
                                provider_transaction_id : transaction_id,
                                round_id : roundId,
                                operator_transaction_id : response.data.data.operator_transaction_id,
                                transaction_amount : amount,
                                transaction_type : transaction_type,
                                action : 'BET',
                                status : 0,
                                created_at : time.now(),
                                updated_at : time.now()
                            }
                            
                            // log the data
                            await commonController.insertLog(logData);

                            // set success response
                            return {
                                uid: data.uid,
                                balance: {
                                    value: (response.data.data.available_balance).toFixed(2),
                                    version: await commonController.getVersion(),
                                    code: 3
                                }
                            }
                        case 'BALANCE_EXCEED':
                            return {
                                "uid": data.uid,            
                                "error": {
                                    "code": "FUNDS_EXCEED"  
                                }
                            }
                        case 'ALREADY_PROCESSED':
                            return {
                                "uid": data.uid,            
                                "error": {
                                    "code": "FUNDS_EXCEED"  
                                }
                            }
                        default:
                            return {
                                "uid": data.uid,            
                                "error": {
                                    "code": "FATAL_ERROR"  
                                }
                            }
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
                bonus : '',
                user_id : userdtls.account_user_id
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
                    return {
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
                                session_id : "",
                                account_id : userdtls.account_id,
                                account_user_id : userdtls.account_user_id,
                                user_id : userdtls._id,
                                game_id : gamedtls._id,
                                game_name : gamedtls.game_name.en,
                                provider_id : provider_id,
                                provider_name : data.provider_name,
                                game_category_id : gamedtls.game_category_id,
                                game_category_name : gamedtls.categorydtls.category,
                                provider_transaction_id : transaction_id,
                                round_id : roundId,
                                operator_transaction_id : response.data.data.operator_transaction_id,
                                transaction_amount : amount,
                                transaction_type : transaction_type,
                                action : 'WIN',
                                status : 0,
                                created_at : time.now(),
                                updated_at : time.now()
                            }
                            
                            // log the data
                            await commonController.insertLog(logData);

                            // set success response
                            return {
                                uid: data.uid,
                                balance: {
                                    value: (response.data.data.available_balance).toFixed(2),
                                    version: await commonController.getVersion(),
                                    code: 3
                                }
                            }
                        case 'ALREADY_PROCESSED':
                            return {
                                "uid": data.uid,            
                                "error": {
                                    "code": "FATAL_ERROR"  
                                }
                            }
                        default:
                            return {
                                "uid": data.uid,            
                                "error": {
                                    "code": "FATAL_ERROR"  
                                }
                            }
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

const rollback = async(data) => {
    try {

        let playerToken = data.token.split("-ucd-");
        let usercode = playerToken[1];
        const userdtls = await commonController.checkUsercodeExists(usercode);
        let provider_id = "65142a47b0aef485da243a29";
        let transaction_type = amount = '';
        let transaction_id = data.uid;
        let gamedtls = await commonController.getGameDetailsByGameCode(data.game_id, provider_id);
        let referenced_transaction_id = data.args.transaction_uid;
        let roundId = data.args.round_id;

        // check transaction
        let transactionValid = await commonController.isTransactionValid(referenced_transaction_id);
        if (!transactionValid) {
            console.log('invalid transaction');
            return {
                "uid": data.uid,            
                "error": {
                    "code": "FATAL_ERROR"  
                }
            }    
        }
        else{
            
            let acountDetails = await AccountsTechnicalsModel.findOne({ account_id: userdtls.account_id }).lean();

            if(checker.isEmpty(acountDetails)){
                return {
                    "uid": data.uid,            
                    "error": {
                        "code": "FATAL_ERROR"  
                    }
                }
            }
            else{

                let dataToSend = {
                    txn_id : referenced_transaction_id
                }

                let config = {
                    method: 'post',
                    url: `${acountDetails.service_endpoint}/callback?function=refund`,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: dataToSend
                };

                let response = await axios(config);

                let validation = await clientValidator.validateResponse(response.data.data, 'rollback');

                if(validation.error === true){
                    return {
                        "uid": data.uid,            
                        "error": {
                            "code": "FATAL_ERROR"  
                        }
                    }
                }
                else{
                    let operator_transaction_id = response.data.data.operator_transaction_id;

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
                            game_category_name : gamedtls.categorydtls.category,
                            provider_transaction_id : transaction_id,
                            round_id : roundId,
                            operator_transaction_id : operator_transaction_id,
                            transaction_amount : amount,
                            transaction_type : transaction_type,
                            action : 'ROLLBACK',
                            status : 0,
                            created_at : time.now(),
                            updated_at : time.now()
                        }

                        // log the data
                        await commonController.insertLog(logData);

                        // set success response
                        return {
                            uid: data.uid,
                            balance: {
                                value: (response.data.data.available_balance).toFixed(2),
                                version: await commonController.getVersion(),
                                code: 3
                            }
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

module.exports = {
    handler: handler ,
};