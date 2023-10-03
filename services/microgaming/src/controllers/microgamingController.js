/**
 * 
 * @author Injamamul Hoque
 * @purpose Microgaming provider integration and game launch related works
 * @createdDate Sep 26 2023
 * @lastUpdated Sep 26 2023
 * @lastUpdatedBy Injamamul Hoque
 */


//Modules Import
let responseLib = require('../libs/responseLib');
const timeLib = require('../libs/timeLib')
let axios = require('axios');
const mongoose = require('mongoose');
const AccountsTechnicalsModel = mongoose.model('AccountsTechnicals');
let clientValidator = require('../middlewares/validators/clientValidator');
const commonController = require('./commonController');


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
        console.log(req.params.function);
        switch (req.params.function) {
            case "auth":
                response = await auth(req.body);
                break;
            case "balance":
                response = await getbalance(req.body);
                break;
            case "transaction":
                if (req.body.category == 'WAGER') {
                    response = await bet(req.body);
                } else if (req.body.category == 'PAYOUT') {
                    response = await win(req.body);
                } else if (req.body.category == 'REFUND') {
                    response = await refund(req.body);
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
        console.error(error);
        return error;
    }
}
/**
 * 
 * @author Injamamul Hoque
 * @function auth
 * @param {*} data(red.body)
 * @returns object
 * 
 */


// auth
let auth = async(req) => {
    //console.log(req);
    try {
        let start = process.hrtime();
        let playerTokenStr = req.token;
        let playerTokeneExplode = playerTokenStr.split("-ucd-");
        let user_code = playerTokeneExplode[1];
        console.log("TIMESTAMP--->", timeLib.kstDatetime());
        const userdtls = await commonController.checkUsercodeExists(user_code);
        let accountDetails = await AccountsTechnicalsModel.find({account_id:userdtls.account_id}).lean()

        /* ********** Get updated wallet balance ********* */
       // let result = await walletController.checkOtherBT(user_code, userdtls.client_id, this.provider_id)
       let config = {
        method: "POST",
        url: `${accountDetails[0].service_endpoint}/user-balance?function=balance`,
        headers:{
            'Content-Type': 'application/json',
        },
        data:{
            user_id: userdtls.account_user_id
        }
    };
    let response = await axios(config);

    let available_balance = response.data.data.cash;

        // let available_balance = 0;

        // if(result.error == 0)
        //     available_balance = parseFloat(result).toFixed(2);
        // // if (result.error == 0) {

        //     available_balance = parseFloat(result.available_balance).toFixed(2);
        // } else {

        //     available_balance = parseFloat(userdtls.available_balance).toFixed(2);

        // }
        // if (available_balance) {
        //     await commonController.updateLastPlayedProvider(user_code, userdtls.client_id, this.provider_id, "SM")
        // }
        /* ********************************************** */


        if (Object.keys(userdtls).length !== 0) {
            let end = process.hrtime(start);
            let result = {
                req_id: req.req_id,
                processing_time: end[0],
                token: req.token,
                username: user_code,
                account_ext_ref: user_code,
                balance: Math.round(available_balance),
                country: 'KR',
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
 * 
 * @author Injamamul Hoque
 * @function get balance
 * @param {*} data(red.body)
 * @returns object
 * 
 */
const getbalance = async(req) => {
    try {
        let start = process.hrtime();
        let playerTokenStr = req.token;
        let playerTokeneExplode = playerTokenStr.split("-ucd-");
        let user_code = playerTokeneExplode[1];

        //console.log("TIMESTAMP--->", timeLib.kstDatetime());
        const userdtls = await commonController.checkUsercodeExists(user_code);
        if(Object.keys(userdtls).length != 0) {
            let accountDetails = await AccountsTechnicalsModel.find({account_id:userdtls.account_id}).lean();
            let config = {
                method: "POST",
                url: `${accountDetails[0].service_endpoint}/user-balance?function=balance`,
                headers:{
                    'Content-Type': 'application/json',
                },
                data:{
                    user_id: userdtls.account_user_id
                }
            };
            let response = await axios(config);
            console.log(response.data.data)
            let validation = await clientValidator.validateResponse(response.data.data,'balance');
            // let payLoad = { "currency": response.data.data.currency, "cash": response.data.data.cash, "bonus": 0, "error": 0, "description": "Success" }
            if(validation.error === false){
                let end = process.hrtime(start);
                let result = {
                    req_id: req.req_id,
                    timestamp: timeLib.kstDatetime(),
                    processing_time: end[0],
                    token: req.token,
                    balance: Math.round(response.data.data.cash)
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
// transaction method

// //bet method
// const bet = async(req) => {
//     try{

//     }catch(err){

//     }
// };
// //win method
// const win = async(req) => {

// };
// //refund method
// const refund = async(req) => {

// };

module.exports = {
    handler: handler ,
};