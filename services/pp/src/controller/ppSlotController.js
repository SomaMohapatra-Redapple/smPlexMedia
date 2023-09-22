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

// let authenticate = async () => {
//     try {
//         const tokenStr = req.body.token;
//         const hash = req.body.hash;
//         let playerToken = tokenStr.split("-ucd-");
//         let usercode = !check.isEmpty(playerToken[1]) ? playerToken[1] : '';

//         const tokenValid = await isTokenvalid(req.body);

//         if (check.checkObjectLen(tokenValid) > 0) {
//             return tokenValid;
//         }

//         /*** get user detail ***/
//         const userdtls = await commonController.checkUsercodeExists(usercode, tokenStr);

//         const client_user_id = userdtls.client_user_id;
//         const client_id = userdtls.client_id;

//         const checkHAshValid = await isHashvalid(bodyData, client_id);

//         if (check.checkObjectLen(checkHAshValid) > 0) {
//             return checkHAshValid;
//         }

//         /* ********** Get updated wallet balance ********* */
//         let result = await walletController.checkOtherBT(usercode, userdtls.client_id, this.provider_id)

//         let balance = parseFloat(userdtls.available_balance).toFixed(2);

//         if (result.error == 0) {

//             balance = parseFloat(result.available_balance).toFixed(2);
//         }

//         if (balance) {
//             await commonController.updateLastPlayedProvider(usercode, userdtls.client_id, this.provider_id, "SM")
//         }
//         /* ********************************************** */

//         const userfieldval = await commonController.getUserDetailsByUserId(client_user_id, client_id);
//         let setdata = {};

//         if (userfieldval) {
//             userfieldval.forEach(element => {
//                 setdata[element.field_key] = element.field_value;
//             });
//         }

//         let payLoad = {
//             status: 200,
//             userId: usercode,
//             currency: userdtls.currency,
//             cash: balance,
//             bonus: 0,
//             token: tokenStr,
//             country: 'US',
//             jurisdiction: setdata.jurisdiction,
//             error: 0,
//             description: "Success"
//         }

//         return res.status(200).send(payLoad);
           
//     } catch (error) {
//         console.log(error.message);
//         const errArr = {
//             error: 120,
//             description: "Internal server error. Casino Operator will return this error code if their system has internal problem and cannot process the request andOperator logic does not require a retry of the request."
//         }

//         return res.status(200).send(payLoad);
//     }
// }

let balance = async (req, res) => {
    try {
        let acountDetails = await AccountsTechnicalsModel.find({ client_id: `650ad4f9a08fe4a5e828815c`, account_id: `650ad363a08fe4a5e8288155` }).lean();

        let config = {
            method: 'post',
            url: `${acountDetails[0].service_endpoint}/user-balance?function=balance`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                "user_id": "1234567890"
            }
        };

        let response = await axios(config);

        // checking the response has any error or not
        if (response.data.err == false) {
            let responseData = response.data.data;
            let function_name = "balance";

            let responseCheck = await ppClientSmValidator.ppSmValidator(function_name, responseData);

            // checking the data format has any error or not
            if (responseCheck.error == false) {
                let payLoad = {
                    "currency": response.data.data.currency,
                    "cash": response.data.data.cash,
                    "bonus": response.data.data.bonus,
                    "error": 0,
                    "description": "Success"
                }
                return res.status(200).send(payLoad);

            } else {
                let payLoad = {
                    "currency": "",
                    "cash": 0,
                    "bonus": 0,
                    "error": 1,
                    "description": "error"
                }

                return res.status(200).send(payLoad);
            }

        } else {
            let payLoad = {
                "currency": "",
                "cash": 0,
                "bonus": 0,
                "error": 1,
                "description": "error"
            }

            return res.status(200).send(payLoad);
        }


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


/*************************************************************************************************/ /* This is the required functions for  */


let isTokenvalid = async (data) => {
    let requestsend = {};
    let tokenStr = (data.hasOwnProperty('token'))?data.token:'';
    let userId = (data.userId) ? data.userId : '';
    let tokenValidate = (data.hasOwnProperty('token'))?tokenStr.includes('-ucd-'):true;
    let playerToken = tokenStr.split("-ucd-");
    usercode = !check.isEmpty(playerToken[1]) ? playerToken[1] : userId;
    const userdtls = (usercode != '') ? await commonController.checkUsercodeExists(usercode, tokenStr) : {};
    let Status = '';
    let code = '';
  
    if (tokenStr && tokenValidate == false) {
      Status = 'Player authentication failed due to invalid, not found or expired token';
      code = 4;
      requestsend = await invalidError(code, Status)
    } else if (Object.keys(userdtls).length < 1) {
      Status = 'Player authentication failed due to invalid, not found or expired token';
      code = 4;
      requestsend = await invalidError(code, Status);
    } else {
      if (userId != '' && userdtls.usercode != userId) {
        Status = "Player not found or is logged out. Should be returned in the response on any request sent by Pragmatic Play if the player can't be found or is logged out at Casino Operator's side";
        code = 2;
        requestsend = await invalidError(code, Status);
      }
  
    }
  
    return requestsend;
  }

module.exports = {
    handler: handler
}



