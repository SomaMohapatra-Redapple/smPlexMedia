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
                url: `${acountDetails.service_endpoint}/authenticate?function=authenticate`,
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
                let version = Math.floor(Date.now() / 1000);
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
                url: `${acountDetails.service_endpoint}/user-balance?function=balance`,
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

const transaction = async(req, res) => {
    return "yess bro";
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
    return "yess bro";
}

module.exports = {
    handler: handler ,
};