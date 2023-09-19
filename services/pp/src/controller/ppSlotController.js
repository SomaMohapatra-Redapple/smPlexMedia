let responseLib = require('../libs/responseLib');
const axios = require("axios").default;

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

let balance = async () => {
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
        console.log(response)
        return response;
    } catch (error) {
        console.log(error.message);
    }
}

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
                response = await balance();

                payLoad = {
                    userBalance: response.data.data
                }

                apiResponse = responseLib.generate(false, "User Balance", payLoad);
                res.status(200).send(apiResponse);
                break;
            default:
                apiResponse = responseLib.generate(false, "No FUnction defined", {});
                res.status(200).send(apiResponse);
                break;
        }
    } catch (error) {
        console.log(error);
        let apiResponse = responseLib.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}


module.exports = {
    handler: handler
}



