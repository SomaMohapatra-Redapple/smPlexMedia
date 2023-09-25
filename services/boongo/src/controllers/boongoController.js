
let responseLib = require('../libs/responseLib');
let axios = require('axios');
let clientValidator = require('../middlewares/validators/clientValidator');
const mongoose = require('mongoose');
const server = require('../../www/rest/server');
const AccountsTechnicalsModel = mongoose.model('AccountsTechnicals');
const commonController = require('../controllers/commonController'); 
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

const login = async(data) => {
    try {
        let uid = data.uid;
    const mode = "REAL";
    let playerToken = data.args.token.split("-ucd-");
    let usercode = playerToken[1];
    const userdtls = await commonController.checkUsercodeExists(usercode);
    let acountDetails = await AccountsTechnicalsModel.find({account_id: userdtls.account_id }).lean();
    
    let config = {
        method: 'post',
        url: `${acountDetails[0].service_endpoint}/user-balance?function=balance`,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            user_id : userdtls.account_user_id                       // YMDJD12
        }
    };

    let response = await axios(config);

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
    } catch (error) {
        console.log(error.message);
        return {
            uid: uid,
            error: {
              code: 'INVALID_TOKEN'
            }
          }
    }
}

const getbalance = async(data) => {
    // const serverStartTime = new Date();
    try {
        let acountDetails = await AccountsTechnicalsModel.find({ client_id: `650ad4f9a08fe4a5e828815c`, account_id: `650ad363a08fe4a5e8288155` }).lean();
        // const walletStartTime = new Date();

        let config = {
            method: 'post',
            url: `${acountDetails[0].service_endpoint}/user-balance?function=balance`,
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
            return {
                "uid": data.uid,            
                "error": {
                    "code": "FATAL_ERROR"  
                }
            }
        }
    } catch (error) {
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