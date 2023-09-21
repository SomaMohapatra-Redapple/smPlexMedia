
let responseLib = require('../libs/responseLib');
let axios = require('axios');
let clientValidator = require('../middlewares/validators/clientValidator');
const mongoose = require('mongoose');
const AccountsTechnicalsModel = mongoose.model('AccountsTechnicals');
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

const getbalance = async(data) => {
    try {

        let acountDetails = await AccountsTechnicalsModel.find({ client_id: `650ad4f9a08fe4a5e828815c`, account_id: `650ad363a08fe4a5e8288155` }).lean();

        let config = {
            method: 'post',
            url: `${acountDetails[0].service_endpoint}/user-balance`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                user_id : 'yudn2mak3lsmj0kgkdmd91'
            }
        };

        let response = await axios(config);
        // console.log(response)

        let validation = await clientValidator.validateResponse(response.data.data, 'balance');

        if(validation.error === false){
            return {
                "uid": data.uid,
                "balance": {
                    "value": parseFloat(response.data.data.cash.toFixed(2)),
                    "version": 0
                },
                "wallet_time": 0,
                "server_time": 0
            }
        }
        else{
            return {
                "uid": data.uid,            
                "error": {
                    "code": "FATAL_ERROR",       
                    "message": `${validation.message}`     
                },
                "wallet_time": 0,     
                "server_time": 0      
            }
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

module.exports = {
    handler: handler ,
};