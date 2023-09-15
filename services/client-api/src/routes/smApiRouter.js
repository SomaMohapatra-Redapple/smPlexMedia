const appConfig = require("../../config/appConfig");
const smApiController = require('../controller/smApiController');


module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/client-api`;

  app.get(`${baseUrl}/user-balance`, smApiController.userBalance);
};

