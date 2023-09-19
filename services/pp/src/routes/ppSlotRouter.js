const appConfig = require("../../config/appConfig");
// const auth = require('../middlewares/auth');
const ppSlotController = require('../controller/ppSlotController');

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/pp/slot`;

  app.post(`${baseUrl}/:function`, ppSlotController.handler);
};

