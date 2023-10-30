let appConfig = require('../../../config/appConfig');
let apiService = appConfig.apiService;

/**
 * 
 * @author Akash Paul
 * @function handler
 * @param {*} req res
 * @returns res
 * 
 */
let handler = async (req, res) => {
    try {
        let response;
        switch (req.params.function) {
            case "getGameUrl":
                response = await getGameUrl(req, res);
                break;
            case "authenticate":
                response = await authenticate(req, res);
                break;
            case "balance":
                response = await balance(req, res);
                break;
            case "bet":
                response = await bet(req, res);
                break;
            case "result":
                response = await result(req, res);
                break;
            case "refund":
                response = await refund(req, res);
                break;
            default:
                response = {
                    error: 120,
                    description: "Internal server error. Casino Operator will return this error code if theirsystem   has   internal   problem   and   cannot   process   the   request   andOperator logic does not require a retry of the request. Request will NOTfollow Reconciliation process"
                }
                break;
        }
        return res.status(200).send(response);
    } catch (error) {
        console.log("API-Server pp slot controller handler function catch error => ", error.message);
        const payLoad = {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if theirsystem   has   internal   problem   and   cannot   process   the   request   andOperator logic does not require a retry of the request. Request will NOTfollow Reconciliation process"
        }

        res.status(200).send(payLoad);
    }
}

/**
 * 
 * @author Akash Paul
 * @function getGameUrl
 * @param {*} req res
 * @returns Obj
 * 
 */
let getGameUrl = async (req, res) => {
    try {
        let url = 'http://18.162.166.6:5003/api/v1/pp/slot/getGameUrl';
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        };
        let response = await apiService.call(url, requestOptions);

        if (response.error == true) {
            return {
                error: 120,
                description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
            }
        }

        // let responseObj = response.response.data;
        let responseObj = await response.response.json();

        return {
            code: 1000,
            message: "SUCCESS",
            data: {
                game_url: responseObj.data.return_url
            }
        }
    } catch (error) {
        console.log("ERROR :: API-Server pp slot controller getGameurl function catch error => ", error.message)
        return {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
        }
    }
}

/**
 * 
 * @author Akash Paul
 * @function authenticate
 * @param {*} req res
 * @returns Obj
 * 
 */
let authenticate = async (req, res) => {
    try {
        let url = 'http://18.162.166.6:5003/api/v1/pp/slot/authenticate';
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        };
        let response = await apiService.call(url, requestOptions);
        if (response.error == true) {
            return {
                error: 120,
                description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
            }
        }

        // let responseObj = response.response.data;
        let responseObj = await response.response.json();
        return responseObj;

    } catch (error) {
        console.log("ERROR :: API-Server pp slot controller getGameurl function catch error => ", error.message)
        return {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
        }
    }
}

/**
 * 
 * @author Akash Paul
 * @function balance
 * @param {*} req res
 * @returns Obj
 * 
 */
let balance = async (req, res) => {
    try {
        let url = 'http://18.162.166.6:5003/api/v1/pp/slot/balance';
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        };
        let response = await apiService.call(url, requestOptions);
        if (response.error == true) {
            return {
                error: 120,
                description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
            }
        }

        // let responseObj = response.response.data;
        let responseObj = await response.response.json();
        return responseObj;

    } catch (error) {
        console.log("ERROR :: API-Server pp slot controller getGameurl function catch error => ", error.message)
        return {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
        }
    }
}

/**
 * 
 * @author Akash Paul
 * @function bet
 * @param {*} req res
 * @returns Obj
 * 
 */
let bet = async (req, res) => {
    try {
        let url = 'http://18.162.166.6:5003/api/v1/pp/slot/bet';
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        };
        let response = await apiService.call(url, requestOptions);
        if (response.error == true) {
            return {
                error: 120,
                description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
            }
        }

        // let responseObj = response.response.data;
        let responseObj = await response.response.json();
        return responseObj;

    } catch (error) {
        console.log("ERROR :: API-Server pp slot controller getGameurl function catch error => ", error.message)
        return {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
        }
    }
}

/**
 * 
 * @author Akash Paul
 * @function result
 * @param {*} req res
 * @returns Obj
 * 
 */
let result = async (req, res) => {
    try {
        let url = 'http://18.162.166.6:5003/api/v1/pp/slot/result';
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        };
        let response = await apiService.call(url, requestOptions);
        if (response.error == true) {
            return {
                error: 120,
                description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
            }
        }

        // let responseObj = response.response.data;
        let responseObj = await response.response.json();
        return responseObj;

    } catch (error) {
        console.log("ERROR :: API-Server pp slot controller getGameurl function catch error => ", error.message)
        return {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
        }
    }
}

/**
 * 
 * @author Akash Paul
 * @function refund
 * @param {*} req res
 * @returns Obj
 * 
 */
let refund = async (req, res) => {
    try {
        let url = 'http://18.162.166.6:5003/api/v1/pp/slot/refund';
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        };
        let response = await apiService.call(url, requestOptions);
        if (response.error == true) {
            return {
                error: 120,
                description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
            }
        }

        // let responseObj = response.response.data;
        let responseObj = await response.response.json();
        return responseObj;

    } catch (error) {
        console.log("ERROR :: API-Server pp slot controller getGameurl function catch error => ", error.message)
        return {
            error: 120,
            description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
        }
    }
}

module.exports = {
    handler: handler
}