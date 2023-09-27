const appConfig = require("../../config/appConfig");
const smApiController = require('../controller/smApiController');
const validator = require('../middlewares/validator/validator');


module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/client-api`;

  app.post(`${baseUrl}/callback`, validator.apiValidator, smApiController.handler);
  // app.post(`${baseUrl}/authenticate`, validator.apiValidator, smApiController.authenticate);
};

