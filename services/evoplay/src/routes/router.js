const fs = require('fs');
const path = require('path');

const appConfig = require("../../config/appConfig");
const auth = require('../middlewares/auth');
// const validator = require('../../middlewares/pp/ppValidator');
// const { rateLimiter, rateLimiterByIP } = require('../../middlewares/rateLimiter');
// const ppSlotController = require("../../controllers/pp/ppSlotController");


module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/pp/slot`;

  //app.post(`${baseUrl}/:function`,validator.ppReqValidator, ppSlotController.handler);
};

