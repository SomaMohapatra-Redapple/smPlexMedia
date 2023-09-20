
let responseLib = require('../libs/responseLib');
let axios = require('axios');

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

module.exports = {
    handler: handler ,
};