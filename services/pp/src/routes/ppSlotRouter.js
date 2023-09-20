const appConfig = require("../../config/appConfig");
// const auth = require('../middlewares/auth');
const ppSlotController = require('../controller/ppSlotController');
const ppValidator = require('../middlewares/validator/ppValidator');

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/pp/slot`;

  app.post(`${baseUrl}/:function`,ppValidator.ppReqValidator, ppSlotController.handler);
};

