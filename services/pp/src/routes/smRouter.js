const appConfig = require("../../config/appConfig");
const auth = require('../middlewares/auth');

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/pp/slot`;

  app.post(`${baseUrl}/:function`,validator.ppReqValidator, ppSlotController.handler);
};

