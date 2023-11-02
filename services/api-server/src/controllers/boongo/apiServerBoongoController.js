let appConfig = require('../../../config/appConfig');
let apiService = appConfig.apiService;

/**
 * 
 * @author Rajdeep Adhikary
 * @function handler
 * @param {*} req res
 * @returns res
 * 
 */
const handler  = async(req, res) => {
    try {
        let url = 'http://18.162.166.6:5007/api/v1/boongo';
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        };
        let response = await apiService.call(url, requestOptions);
        if (response.error == true) {
            res.status(503).send({
                "uid": data.uid,            
                "error": {
                    "code": "FATAL_ERROR" 
                }
            });
            return;
        }

        // let responseObj = response.response.data;
        let responseObj = await response.response.json();
        res.status(200).send(responseObj);
        return;

    } catch (error) {
        console.log("API SERVER ERROR : ", error.message)
        res.status(500).send({
            "uid": data.uid,            
            "error": {
                "code": "FATAL_ERROR" 
            }
        });
        return;
    }
}


module.exports = {
    handler: handler
}