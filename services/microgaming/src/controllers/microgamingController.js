/**
 * 
 * @author Injamamul Hoque
 * @purpose Microgaming provider integration and game launch related works
 * @createdDate Sep 26 2023
 * @lastUpdated Sep 28 2023
 * @lastUpdatedBy Injamamul Hoque
 */


//Modules Import
const {v4 : uuidv4} = require('uuid')
let responseLib = require('../libs/responseLib');
const checkLib = require('../libs/checkLib')
const timeLib = require('../libs/timeLib')
let axios = require('axios');
const mongoose = require('mongoose');
const AccountsTechnicalsModel = mongoose.model('AccountsTechnicals');
const transactionModel = mongoose.model('Transaction');
let clientValidator = require('../middlewares/validators/clientValidator');
const commonController = require('./commonController');
const  redis = require('../libs/redisLib')


const appConfig = require("../../config/appConfig");
let provider_id = appConfig.provider_id
console.log(provider_id);



/**
 * 
 * @author Injamamul Hoque
 * @function handler
 * @param {*} req res
 * @returns res
 * 
 */

const handler  = async(req, res) => {
    try{
        let response;
        let function_type = req.params.function;
        switch (req.params.function) {
            case "authenticate":
                response = await authenticate(req.body,function_type);
                break;
            case "balance":
                response = await getbalance(req.body,function_type);
                break;
            case "transaction":
                if (req.body.category == 'WAGER') {
                    response = await bet(req.body,function_type);
                } else if (req.body.category == 'PAYOUT') {
                    response = await win(req.body,function_type);
                } else if (req.body.category == 'REFUND') {
                    response = await refund(req.body,function_type);
                } else {
                    response = {}
                }
                break;
            case "getGameUrl":
                response = await getGameUrl(req.body);
                break;
            default:
                response = {}
                break;
        }
        res.status(200).send(response);

    }
    catch(error){
        console.log("Error is : ",)
        return error;
    }
}
/**
 * @purpose Authentication
 * @author Injamamul Hoque
 * @function authenticate
 * @param {*} data(req.body)
 * @returns object
 * 
 */


// auth
let authenticate = async(req,function_type) => {
   
    try {
    
        let start = process.hrtime();
        let playerTokenStr = req.token;
        let playerTokeneExplode = playerTokenStr.split("-ucd-");
        let user_code = playerTokeneExplode[1];
        console.log("TIMESTAMP--->", timeLib.kstDatetime());
        const userdtls = await commonController.checkUsercodeExists(user_code);
        let accountDetails = await AccountsTechnicalsModel.find({account_id:userdtls.account_id}).lean()
        if(checkLib.isEmpty(accountDetails)){

            const payLoad = {
                error:2,
                description: "Player not found or is logged out. Should be returned in the response onany request sent by Pragmatic Play if the player can’t be found or islogged out at Casino Operator’s side"
            }
            return payLoad;
        }else{
        /* ********** Get updated wallet balance ********* */
       let config = {
        method: "POST",
        url: `${accountDetails[0].service_endpoint}/callback?function=authenticate`,
        headers:{
            'Content-Type': 'application/json',
        },
        data:{
            user_id: userdtls.account_user_id
        }
    };
            console.log("url is ",accountDetails[0].service_endpoint)
            
            // let postData = {
            //     user_id: userdtls.account_user_id
            // };
           // let response = await commonController.postDataFromAPI(accountDetails[0].service_endpoint,function_type,postData);
        let response = await axios(config);
        
            //checking the response has any errors or not
            if(response.data.err == true){
                code = 120;
                Status = "Internal Server error";
                return await invalidError(code,Status);
            }

            let validation = await clientValidator.validateResponse(response.data,function_type);
            // let payLoad = { "currency": response.data.data.currency, "cash": response.data.data.cash, "bonus": 0, "error": 0, "description": "Success" }
                if(validation.error === false){
                    let available_balance = response.data.amount;
                    if (Object.keys(userdtls).length !== 0) {
                        let end = process.hrtime(start);
                        let result = {
                            req_id: req.req_id,
                            processing_time: end[0],
                            token: req.token,
                            username: user_code,
                            account_ext_ref: user_code,
                            balance: Math.round(available_balance),
                            country: response.data.country,
                            currency: userdtls.currency_code,
                            lang: 'en',
                            timestamp: timeLib.kstDatetime()
                        }
        
                        return {
                            error: 0,
                            status_code: 200,
                            result: result
                        }
                    } else {
                        let end = process.hrtime(start);
                        let result = {
                            req_id: req.req_id,
                            processing_time: end[0],
                            token: req.token,
                            timestamp: timeLib.kstDatetime(),
                            err_desc: 'Invalid token or expired token'
                        }
                        return {
                            error: 1,
                            status_code: 400,
                            result: result
                        }
                    }
                }else{
                    return {
                        "uid": req.uid,            
                        "error": {
                        "code": "FATAL_ERROR"  
                        }
                    }
                }
        }
    } catch (err) {
        console.log(`ERROR ${err}`);
        let result = {
            req_id: req.req_id,
            //processing_time: end[0],
            token: req.token,
            timestamp: timeLib.kstDatetime(),
            err_desc: `${err.message}`
        }
        return {
            error: 1,
            status_code: 400,
            result: result
        }
    }
}

/**
 * @author Injamamul Hoque
 * @function get balance
 * @param {*} data(req.body)
 * @returns object
 * 
 */
const getbalance = async(req,function_type) => {
    try {
        let start = process.hrtime();
        let playerTokenStr = req.token;
        let playerTokeneExplode = playerTokenStr.split("-ucd-");
        let user_code = playerTokeneExplode[1];

        //console.log("TIMESTAMP--->", timeLib.kstDatetime());
        const userdtls = await commonController.checkUsercodeExists(user_code);
        if(Object.keys(userdtls).length != 0) {
            let accountDetails = await AccountsTechnicalsModel.find({account_id:userdtls.account_id}).lean();
            if(checkLib.isEmpty(accountDetails)){

                const payLoad = {
                    error:2,
                    description: "Player not found or is logged out. Should be returned in the response onany request sent by Pragmatic Play if the player can’t be found or islogged out at Casino Operator’s side"
                }
                return payLoad;

            }else{
            

            // let postData = {
            //     user_id: userdtls.account_user_id
            // };
            // let response = await commonController.postDataFromAPI(accountDetails[0].service_endpoint,function_type,postData);
            // console.log("response data is....",response.data)
            
            let config = {
                method: "POST",
                url: `${accountDetails[0].service_endpoint}/callback?function=balance`,
                headers:{
                    'Content-Type': 'application/json',
                },
                data:{
                    user_id: userdtls.account_user_id
                }
            }
            let response = await axios(config);
            console.log("response...",response.data)
            let validation = await clientValidator.validateResponse(response.data.data,function_type);
            // let payLoad = { "currency": response.data.data.currency, "cash": response.data.data.cash, "bonus": 0, "error": 0, "description": "Success" }
            if(validation.error === false){
                let end = process.hrtime(start);
                let result = {
                    req_id: req.req_id,
                    timestamp: timeLib.kstDatetime(),
                    processing_time: end[0],
                    token: req.token,
                    balance: Math.round(response.data.data.amount)
                }
                return {
                    error: 0,
                    status_code: 200,
                    result: result
                }
            }else{
                return {
                    "uid": req.uid,            
                    "error": {
                        "code": "FATAL_ERROR"  
                    }
                }
            }
        }
        }else{
            let end = process.hrtime(start);
            let result = {
                req_id: req.req_id,
                processing_time: end[0],
                token: req.token,
                timestamp: timeLib.kstDatetime(),
                err_desc: 'Invalid token or expired token'
            }
            return {
                error: 1,
                status_code: 400,
                result: result
            } 
        }
    
    } catch (error) {
        return {
            "uid": req.uid,            
            "error": {
                "code": "FATAL_ERROR",       
                "message": error.message     
            }      
        }
    }
}
// transactions methods
/**
 * @purpose Transaction methods
 * @author Injamamul Hoque
 * @function bet
 * @param {*} req res
 * @returns object
 * 
 */

//bet method
let bet = async (req,function_type) => {
    let start = process.hrtime();
    try {
        let playerTokenStr = req.token;
        let playerTokeneExplode = playerTokenStr.split("-ucd-");
        let user_code = playerTokeneExplode[1];
        const transactionAmount = req.amount;

        const userdtls = await commonController.checkUsercodeExists(user_code);
            if (userdtls) {
                let betStatus = await commonController.isBetEnable( userdtls.account_id);
                if(betStatus.rejectionStatus === true || betStatus.maintenance_mode_status === 'Y'){
                    return {
                        "uid": data.uid,            
                        "error": {
                        "code": "SESSION_CLOSED"  
                        }
                    }
            }
           // ...............
            const checkDuplicateRecord = await transactionModel.count({ transaction_id: req.tx_id });
            if (checkDuplicateRecord > 0) {
                let end = process.hrtime(start);
                let result = {
                    req_id: req.req_id,
                    processing_time: end[0],
                    token: req.token,
                    timestamp: timeLib.kstDatetime(),
                    err_desc: 'Transaction has already been processed'
                }
                return {
                    error: 1,
                    status_code: 409,
                    result: result
                }
            }
            //game details
            const getGameDetails = await commonController.getGameDetails();
            console.log('game details', getGameDetails)
            // request send to client
             let accountDetails = await AccountsTechnicalsModel.find({account_id:userdtls.account_id}).lean();
            let config = {
                method: "POST",
                url: `${accountDetails[0].service_endpoint}/callback?function=bet`,
                headers:{
                    'Content-Type': 'application/json',
                },
                data:{
                    user_id: userdtls.account_user_id,
                    game_id:getGameDetails._id,
                    round_id:req.round_id ,
                    txn_id:req.tx_id,
                    category_id:getGameDetails.game_category_id,
                    bet_amount:transactionAmount, 
                    bonus:""
                }
            };
            // we want balance in response 
            let response = await axios(config);

            // let postData = {
            //     user_id : userdtls.account_user_id,
            //     game_id : getGameDetails._id,
            //     round_id : req.round_id,
            //     txn_id : req.tx_id,
            //     category_id : getGameDetails.game_category_id,
            //     bet_amount : transactionAmount,
            //     bonus : " "

            // };

            // let response = await commonController.postDataFromAPI(accountDetails[0].service_endpoint,function_type,postData);
            

            // transaction logging
             let validation = await clientValidator.validateResponse(response.data.data,'transaction');
            // let payLoad = { "currency": response.data.data.currency, "cash": response.data.data.cash, "bonus": 0, "error": 0, "description": "Success" }
                 if(validation.error === false){
                // if (response.data.code === "SUCCEED") {
                    let trns_dtls= await commonController.logTransaction("BET",req,user_code,response.data.data.operator_transaction_id);
                    //console.log("transaction details in controller",trns_dtls);
                    let end = process.hrtime(start);
                    let result = {
                        req_id: req.req_id,
                        processing_time: end[0],
                        token: req.token,
                        balance: response.data.data.available_balance,
                        ext_tx_id: trns_dtls._id,
                        timestamp: timeLib.kstDatetime()
                    }

                    return {
                        error: 0,
                        status_code: 200,
                        result: result
                    }

                } else {
                    // Operation failed
                    let end = process.hrtime(start);
                    let result = {
                        req_id: req.req_id,
                        processing_time: end[0],
                        token: req.token,
                        timestamp: timeLib.kstDatetime(),
                        err_desc: 'Process Failed'
                    }

                    return {
                        error: 1,
                        status_code: 400,
                        result: result
                    }
                }
            // }else{
            //     return {
            //         "uid": req.uid,            
            //         "error": {
            //             "code": "FATAL_ERROR"  
            //         }
            //     }
            // }
            
        } else {
            let end = process.hrtime(start);
            let result = {
                req_id: req.req_id,
                processing_time: end[0],
                token: req.token,
                timestamp: timeLib.kstDatetime(),
                err_desc: 'Bad Request or invalid message format'
            }
            return {
                error: 1,
                status_code: 400,
                result: result
            }
        }
    } catch (err) {
        console.log(`ERROR ---> ${err}`);
        let end = process.hrtime(start);
        let result = {
            req_id: req.req_id,
            processing_time: end[0],
            token: req.token,
            timestamp: timeLib.kstDatetime(),
            err_desc: err
        }
        return {
            error: 1,
            status_code: 400,
            result: result
        }

    }
}

/**
 * @author Injamamul Hoque
 * @function win 
 * @param {*} data(req.body)
 * @returns object
 * 
 */

let win = async (req) => {
    let start = process.hrtime();
    try {
        //const createdIp = req.created_ip;
        let playerTokenStr = req.token;
        let playerTokeneExplode = playerTokenStr.split("-ucd-");
        let user_code = playerTokeneExplode[1];
        const transactionAmount = req.amount;

        const userdtls = await commonController.checkUsercodeExists(user_code);
        //console.log("user details ",userdtls)
        if (userdtls) {
            const checkDuplicateRecord = await transactionModel.count({ provider_transaction_id: req.tx_id,transaction_type:"CREDIT"});
            if (checkDuplicateRecord > 0) {
                let end = process.hrtime(start);
                let result = {
                    req_id: req.req_id,
                    processing_time: end[0],
                    token: req.token,
                    timestamp: timeLib.kstDatetime(),
                    err_desc: 'Transaction has already been processed'
                }
                return {
                    error: 1,
                    status_code: 409,
                    result: result
                }
            }

            const getGameDetails = await commonController.getGameDetails();
            let  game_category_id = getGameDetails.game_category_id;
            console.log(getGameDetails);
            const debitDetails = await transactionModel.findOne({ round_id: req.round_id});
            if (check.isEmpty(debitDetails)) {
                let end = process.hrtime(start);
                let result = {
                    req_id: req.req_id,
                    processing_time: end[0],
                    token: req.token,
                    timestamp: timeLib.kstDatetime(),
                    err_desc: 'Round Id not found'
                }
                return {
                    error: 1,
                    status_code: 409,
                    result: result
                }
            }
            let accountDetails = await AccountsTechnicalsModel.find({account_id:userdtls.account_id}).lean();
            let config = {
                    method: "POST",
                    url: `${accountDetails[0].service_endpoint}/callback?function=win`,
                    headers:{
                        'Content-Type': 'application/json',
                    },
                    data:{
                        user_id: userdtls.account_user_id,
                        game_id:getGameDetails._id,
                        round_id:req.round_id, 
                        txn_id:req.tx_id,
                        category_id:game_category_id,
                        win_amount:transactionAmount,
                        bonus: " "
                    }
                }
                let response = await axios(config);
                let validation = await clientValidator.validateResponse(response.data.data,'transaction');
                // let payLoad = { "currency": response.data.data.currency, "cash": response.data.data.cash, "bonus": 0, "error": 0, "description": "Success" }
                     if(validation.error === false){
                    // if (response.data.code === "SUCCEED") {
                        let trns_dtls= await commonController.logTransaction("WIN",req,user_code,response.data.data.operator_transaction_id);
                        //console.log("transaction details in controller",trns_dtls);
                        let end = process.hrtime(start);
                        let result = {
                            req_id: req.req_id,
                            processing_time: end[0],
                            token: req.token,
                            balance: response.data.data.available_balance,
                            ext_tx_id: trns_dtls._id,
                            timestamp: timeLib.kstDatetime()
                        }
    
                        return {
                            error: 0,
                            status_code: 200,
                            result: result
                        }
    
                    } else {
                        // Operation failed
                        let end = process.hrtime(start);
                        let result = {
                            req_id: req.req_id,
                            processing_time: end[0],
                            token: req.token,
                            timestamp: timeLib.kstDatetime(),
                            err_desc: 'Process Failed'
                        }
    
                        return {
                            error: 1,
                            status_code: 400,
                            result: result
                        }
                    }
        } else {
            let end = process.hrtime(start);
            let result = {
                req_id: req.req_id,
                processing_time: end[0],
                token: req.token,
                timestamp: timeLib.kstDatetime(),
                err_desc: 'Bad Request or invalid message format'
            }
            return {
                error: 1,
                status_code: 400,
                result: result
            }
        }
    } catch (err) {
        console.log(`ERROR ---> ${err}`);
        let end = process.hrtime(start);
        let result = {
            req_id: req.req_id,
            processing_time: end[0],
            token: req.token,
            timestamp: timeLib.kstDatetime(),
            err_desc: err
        }
        return {
            error: 1,
            status_code: 400,
            result: result
        }
    }
}

/**
 * @author Injamamul Hoque
 * @function refund 
 * @param {*} data(req.body)
 * @returns object
 * 
 */

let refund = async (req) => {
    try {

        let start = process.hrtime();
        let playerTokenStr = req.token;
        let playerTokeneExplode = playerTokenStr.split("-ucd-");
        let user_code = playerTokeneExplode[1];
        const transactionAmount = req.amount;

        const userdtls = await commonController.checkUsercodeExists(user_code);

        if (userdtls) {
           const checkDuplicateRecord = await transactionModel.count({provider_transaction_id : req.refund_tx_id, transaction_type: "CREDIT" });
            if (checkDuplicateRecord > 0) {
                let end = process.hrtime(start);
                let result = {
                    req_id: req.req_id,
                    processing_time: end[0],
                    token: req.token,
                    timestamp: timeLib.kstDatetime(),
                    err_desc: 'Transaction has already been processed'
                }
                return {
                    error: 1,
                    status_code: 409,
                    result: result
                }
            }

            const getGameDetails = await commonController.getGameDetails();
            let  game_category_id = getGameDetails.game_category_id;
            //console.log(getGameDetails);
            const refundDetails = await transactionModel.findOne({ round_id: req.round_id, transaction_type: "CREDIT"})
            if(check.isEmpty(refundDetails)) {
                let end = process.hrtime(start);
                let result = {
                    req_id: req.req_id,
                    processing_time:end[0],
                    token : req.token,
                    timestamp:timeLib.kstDatetime(),
                    err_desc: "Round Id not found"
                }
                return {
                    error: 1,
                    status_code:409,
                    result:result
                }
            }
            let accountDetails = await AccountsTechnicalsModel.find({account_id:userdtls.account_id}).lean();
            let config = {
                method: "POST",
                url: `${accountDetails[0].service_endpoint}/callback?function=refund`,
                headers:{
                    'Content-Type': 'application/json',
                },
                data:{
                        user_id: userdtls.account_user_id,
                        game_id:getGameDetails._id,
                        round_id:req.round_id ,
                        txn_id:req.refund_tx_id,
                        category_id:game_category_id,
                        refund_amount:transactionAmount,
                        bonus:" "
                }
            }
            let response = await axios(config);
                // let updt_balence = response.data.amount;
                // // Transaction logging
                // let refundDataInsert = await commonController.logTransaction(req,user_code,this.provider_id,response.data.operator_transaction_id);
                // let end = process.hrtime(start);
                // let result = {
                //     req_id:req.req_id,
                //     processing_time:end[0],
                //     token:req.token,
                //     balence:parseInt(updt_balence),
                //     ext_tx_id:refundDataInsert._id,
                //     timestamp:timeLib.kstDatetime()
                // }

                // return {
                //     error:0,
                //     status_code:200,
                //     result:result
                // }
                //................
                let validation = await clientValidator.validateResponse(response.data.data,'transaction');
                // let payLoad = { "currency": response.data.data.currency, "cash": response.data.data.cash, "bonus": 0, "error": 0, "description": "Success" }
                     if(validation.error === false){
                    // if (response.data.code === "SUCCEED") {
                        let trns_dtls= await commonController.logTransaction("REFUND",req,user_code,response.data.data.operator_transaction_id);
                        //console.log("transaction details in controller",trns_dtls);
                        let end = process.hrtime(start);
                        let result = {
                            req_id: req.req_id,
                            processing_time: end[0],
                            token: req.token,
                            balance: response.data.data.available_balance,
                            ext_tx_id: trns_dtls._id,
                            timestamp: timeLib.kstDatetime()
                        }
    
                        return {
                            error: 0,
                            status_code: 200,
                            result: result
                        }
    
                    } else {
                        // Operation failed
                        let end = process.hrtime(start);
                        let result = {
                            req_id: req.req_id,
                            processing_time: end[0],
                            token: req.token,
                            timestamp: timeLib.kstDatetime(),
                            err_desc: 'Process Failed'
                        }
    
                        return {
                            error: 1,
                            status_code: 400,
                            result: result
                        }
                    }
                //.......
                

        } else {
            let end = process.hrtime(start);
            let result = {
                req_id: req.req_id,
                processing_time: end[0],
                token: req.token,
                timestamp: timeLib.kstDatetime(),
                err_desc: 'Bad Request or invalid message format'
            }
            return {
                error: 1,
                status_code: 400,
                result: result
            }
        }
    } catch (err) {
        console.log(`ERROR ---> ${err}`);
        let end = process.hrtime(start);
        let result = {
            req_id: req.req_id,
            processing_time: end[0],
            token: req.token,
            timestamp: timeLib.kstDatetime(),
            err_desc: err
        }
        return {
            error: 1,
            status_code: 400,
            result: result
        }

    }
}

/**
 * @author Injamamul Hoque
 * @function refund 
 * @param {*} data(req.body)
 * @returns object
 * 
 */

  

  let getGameUrl = async (req) => {
   // console.log("i'm in getGameUrl section.....",req);
    try {
      let resultarr = '';
      const userCode = req.user_code;
      const token = req.token;
      const language = req.language.toLowerCase();
      const account_id = req.account_id;
      const currency = req.currency;
      const game_code = req.game_code;
      const return_url = req.return_url;
  
      const user_details = await commonController.checkUsercodeExists(userCode);
  
      // ************************************************************** */
      // ************ Checking Maintenance mode status ************** /
     // let maintenanceModeStatus = await walletController.betControlStatus(userCode, user_details.client_id);
    //   if (maintenanceModeStatus.maintenance_mode_status == 'Y') {
    //     return {
    //       status: "1",
    //       code: "10001",
    //       message: "Maintenance in progress. Try again later!"
    //     }
    //   }
      /// *************************************************** */
  
     // let status = await checkTokenKeySession(user_details.client_id, token, userCode);
  
      //if ((status == 1) || (status == 2)) {
  
        // let user_id = user_details.user_id;
        // let user_provider_table = "client_users_provider_details_" + user_details.client_id;
  
        // const field_keys = [];
        // const provider_params = await commonController.get_provider_params(user_details.client_id, this.provider_id);
  
        // if (provider_params.length > 0) {
        //   provider_params.forEach(provider_param => {
        //     this[provider_param.field_key] = provider_param.field_value;
        //   });
        // }


        let provider_id = appConfig.provider_id;

        if(await commonController.isAccountExists(account_id) === false){
            return {
                success: false,
                code: "INVALID_ACCOUNT_ID", // Invalid Account Id
                data: {}
            }
        }

        let betStatus = await commonController.isBetEnable(account_id);
        if(betStatus.rejectionStatus === true){
            return {
                success: false,
                code: "PROVIDER_NOT_TAKEN", // Provider and client not mapped
                data: {}
            }
        }

        if(betStatus.maintenance_mode_status === 'Y'){
            return {
                success: false,
                code: "IN_MAINTENANCE_MODE", // Provider and client not mapped
                data: {}
            }
        }

        const isUser = await commonController.checkUserExistOrRegister(userCode, account_id);
        if(isUser.error){
            return {
                success: false,
                code: "FATAL_ERROR",  // Invalid user or unable to save user
                data: {}
            }
        }
        let user = isUser.data;


        let getProviderAccount = await commonController.checkProviderAccountLink(account_id, provider_id); //get provider id first

        if(getProviderAccount.error){
            return {
                success: false,
                code: "FATAL_ERROR", // account id not mapped with any provider account & unable to retrieve default provider account
                data: {}
            }
        }

        let providerAccountId = getProviderAccount.data;

        // console.log(providerAccountId);

        let providerTechnicals = await commonController.getProviderAccountTechnicals(providerAccountId);
        
        if(providerTechnicals.error === true){
            return {
                success: false,
                code: "FATAL_ERROR", // unable to get provider account details from redis
                data: {}
            }
        }

        providerTechnicals = providerTechnicals.data;
       // console.log("provider account technicals ", providerTechnicals)

        if(providerTechnicals.currency.includes(currency) === false){
            return {
                success: false,
                code: "INVALID_CURRENCY", // currency not supported by provider
                data: {}
            }
        }

        let game_details = await commonController.getGameDetailsByGameId(game_code);
        //console.log("game details...",game_details)
        if (game_details) {
          
          let auth_params = {
            username: providerTechnicals.technical_details.user_api,
            password: providerTechnicals.technical_details.user_api_pass,
            user_auth: providerTechnicals.technical_details.user_auth,
            user_auth_pass: providerTechnicals.technical_details.user_auth_pass,
            token_url: providerTechnicals.technical_details.token_url,
          };

          await redis.addWithTtl(`user-${user._id}-game-${game_code}`, token, appConfig.sessionExpTime);

          let PlayerToken = `${token}-ucd-${user._id}`; 
          //let gmCode = gamedtls.game_code;
          
        let provider_auth_token = await commonController.setAuthToken(auth_params, language, 'ZAR'); //user_details.currency
          //const token_details = await commonController.getToken(this.provider_id);
         console.log("provider auth token...",provider_auth_token)
      
      //console.log(result); return
      let launch_param = {
        token: PlayerToken,
        external: "true",
        demo: "false",
        game_id: game_details.game_code,
        app_id: (req.isMobile)?"1002":"1001",
        login_context: {
          lang: language,
          meta_data: {
            ip: req.created_ip,
            session_key: req.token,
            user_agent:""
          },
        },
        conf_params: {
          titanium: "default",
          lobby_url:  req.return_url,
          logout_url: req.return_url,
          failed_url: req.return_url,
        },
      };
  
      console.log("lunch param..",launch_param)
      
      let headers = {
        "Content-Type": "application/json",
        "Authorization": (provider_auth_token? "Bearer " + provider_auth_token: ""),
        "X-DAS-TX-ID": uuidv4(), 
        "X-DAS-TZ": "UTC+9",
        "X-DAS-LANG": 'en',//language,
        "X-DAS-CURRENCY": 'USD',//user_details.currency,
        "Cookie": "__cfduid=d08acbe4073a67c4e5ce9f19bef8501d91614768922",
      };
      
      let game_launch_url = providerTechnicals.technical_details.game_launch_url
      // console.log("game lunch url .....",game_launch_url);
      // console.log(launch_param);
       //console.log("headers.....",headers);
      //return false;
  
      const response = await axios.post(game_launch_url, launch_param, {
        headers: headers,
      });
  
      console.log("Response is ...",response.data)

      if (!response.data.hasOwnProperty('error') && response.data.hasOwnProperty('data')) {
  
        let resultarr = { status: 0, code: "success", message: "Game URL has been generated!", data: { return_url: response.data.data } };
        return resultarr;
      } else {
        let resultarr = {
          "status": "1",
          "code": "1007",
          "message": response.data.error.message
        }
  
        return resultarr;
      }
  
        } else {
          resultarr = {
            "status": "error",
            "code": "4009",
            "message": "Game not found!"
          }
        }
    //   } else {
    //     resultarr = {
    //       "status": "error",
    //       "code": "1007",
    //       "message": "User token invalid"
    //     }
    //   }
    //   return resultarr;
    } catch (error) { 
      console.log("error message....",error);
      return false;
    }
  }





module.exports = {
    handler: handler ,
};