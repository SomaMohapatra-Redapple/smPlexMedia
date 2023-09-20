let responseLib = require('../libs/responseLib');
let ppClientSmValidator = require('../middlewares/validator/ppClientSmValidator');
let axios = require("axios").default;
let mongoose = require('mongoose');
let AccountsTechnicalsModel = mongoose.model('AccountsTechnicals')


//// This the function handler
let handler = async (req, res) => {
    try {
        let response;
        let payLoad;
        let apiResponse;
        switch (req.params.function) {
            case "getGameUrl":
                response = await getGameUrl();
                break;
            case "authenticate":
                response = await authenticate();
                break;
            case "balance":
                response = await balance(req, res);
                break;
            case "bet":
                response = await bet(req, res);
                break;
            default:
                apiResponse = responseLib.generate(false, "No Function defined", {});
                res.status(200).send(apiResponse);
                break;
        }
    } catch (error) {
        console.log(error);
        let apiResponse = responseLib.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

let getGameUrl = async () => {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

let authenticate = async () => {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

let balance = async (req, res) => {
    try {
        let acountDetails = await AccountsTechnicalsModel.find({ client_id: `650ad4f9a08fe4a5e828815c`, account_id: `650ad363a08fe4a5e8288155` }).lean();

        let config = {
            method: 'get',
            url: `${acountDetails[0].service_endpoint}/user-balance`,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        let response = await axios(config);

        let responseData = response.data.data;
        let function_name = "balance";
        // let responseCheck = ppClientSmValidator.ppSmValidator(function_name, responseData);

        // console.log(responseCheck)

        let payLoad = {
            "currency": response.data.data.currency,
            "cash": response.data.data.cash,
            "bonus": response.data.data.bonus,
            "error": 0,
            "description": "Success"
        }

        return res.status(200).send(payLoad);
    } catch (error) {
        console.log(error.message);
        let payLoad = {
            "currency": "",
            "cash": 0,
            "bonus": 0,
            "error": 1,
            "description": error.message
        }

        return res.status(200).send(payLoad);
    }
}

let bet = async (req, res) => {
    try {

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    handler: handler
}



