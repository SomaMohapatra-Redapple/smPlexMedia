const appConfig = require("../../../config/appConfig");
const gameLaunchController = require('../../controllers/gameLaunch/gameLaunchController');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/api-server/game-launch`;

    app.post(`${baseUrl}`, gameLaunchController.handler);
};