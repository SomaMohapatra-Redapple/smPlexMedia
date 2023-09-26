
let responseLib = require('../libs/responseLib');
let tokenLib = require('../libs/tokenLib');
let axios = require('axios');
let clientValidator = require('../middlewares/validators/clientValidator');

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
            case "auth":
                response = await auth(req.body);
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

const getbalance = async(data) => {
    try {
        let config = {
            method: 'get',
            url: 'http://localhost:5008/api/v1/client-api/user-balance',
            headers: {
                'Content-Type': 'application/json',
            },
            // data: data
        };

        let response = await axios(config);
        // console.log(response)

        // let payLoad = { "currency": response.data.data.currency, "cash": response.data.data.cash, "bonus": 0, "error": 0, "description": "Success" }

        return {
            "uid": data.uid,
            "balance": {
                "value": parseFloat(response.data.data.cash.toFixed(2)),
                "version": 0
            },
            "wallet_time": 0,
            "server_time": 0
        }
    } catch (error) {
        return {
            "uid": data.uid,            
            "error": {
                "code": "FATAL_ERROR",       
                "message": error.message     
            },
            "wallet_time": 0,     
            "server_time": 0      
        }
    }
}

// authentication
const auth= async(data)=>{
    try{
        let start = process.hrtime();
        let playerTokenStr = req.token;
        let playerTokeneExplode = playerTokenStr.split("-ucd-");
        let user_code = playerTokeneExplode[1];
        console.log("TIMESTAMP: ",timeLib.kstDate());
        const userdtls = await commonController.checkUsercodeExists(user_code);// I have to check it
        let balance = await getbalance(data.user_id)// i have to check it
        let available_balence = 0;
        if(balance.error == 0){
            available_balence = parseFloat(balance.available_balence).toFixed(2);
        }else{
            available_balence = parseFloat(userdtls.available_balence).toFixed(2);
        }
        // if(available_balence){
        //     await commonController.updateLastPlayedProvider(user_code,userdtls.client_id,this.provider_id,"SM")

        // }
        if (Object.keys(userdtls).length !== 0) {
            let end = process.hrtime(start);
            let result = {
                req_id: req.req_id,
                timestamp: timeLib.kstDatetime(),
                processing_time: end[0],
                token: await tokenLib.generateToken(userdtls) ,
                username: user_code,
                account_ext_ref: user_code,
                balance: Math.round(available_balance),
                country: 'KR',
                currency: userdtls.currency,
                lang: 'en'
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


    }catch(err){
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

// login
const login = async(req, res) => {
    try {


    }catch(err){

    }
}
// transaction
const transaction = async(req, res) => {
    try{

    }catch(err){

    }
};

module.exports = {
    handler: handler ,
};