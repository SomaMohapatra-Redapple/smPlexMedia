/**
 * 
 * @author Akash Paul
 * @purpose To channelise requests to appropriate servers
 * @createdDate Oct 25 2023
 * @lastUpdated Oct 27 2023
 * @lastUpdatedBy Akash Paul
 */

let appConfig = require('../../../config/appConfig');
let apiService = appConfig.apiService;
let redisLib = require('../../libs/redisLib');
let mongoose = require('mongoose');
let gameModel = mongoose.model('Game');

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
        let gameId = req.body.game_id;
        let gameData = await gameModel.aggregate(
            [
                {
                    $match: {
                        "_id": new mongoose.Types.ObjectId(gameId)
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "game_category_id",
                        foreignField: "_id",
                        as: "categories"
                    }
                }
            ]
        );
        let providerId = gameData[0].game_provider_id;
        let providerData = await redisLib.get(`provider-${providerId}`);
        let providerName = providerData.data.name;
        let response;
        switch (providerName) {
            case "pp":
                response = await ppGetGameUrl(req, res, gameData);
                break;
            case "":
                response = await boongoGetGameUrl(req, res);
                break;
            default:
                response = {
                    code: 1004,
                    message: "FATAL_ERROR",
                    data: {}
                }
                break;
        }
        return res.status(200).send(response);
    } catch (error) {
        console.log("API-Server game-launch controller handler catch error => ", error.message);
        payLoad = {
            code: 1004,
            message: "FATAL_ERROR",
            data: {}
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
let ppGetGameUrl = async (req, res, gameData) => {
    try {
        let gameCategory = gameData[0].categories[0].category_name.en;
        if (gameCategory == 'slot') {
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
                    code: 1004,
                    message: "FATAL_ERROR",
                    data: {}
                }
            }

            // let responseObj = response.response.data;
            let responseObj = await response.response.json();
            return responseObj;
        }
        if (gameCategory == 'lc') {

        }

    } catch (error) {
        console.log("ERROR :: API-Server pp slot controller getGameurl function catch error => ", error.message)
        return {
            code: 1004,
            message: "FATAL_ERROR",
            data: {}
        }
    }
}


module.exports = {
    handler: handler
}