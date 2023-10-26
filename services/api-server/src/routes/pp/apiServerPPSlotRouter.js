const appConfig = require("../../../config/appConfig");
const apiServerPPSlotController = require('../../controllers/pp/apiServerPPSlotController');

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/pp/slot`;

  app.post(`${baseUrl}/:function`,apiServerPPSlotController.handler);
};