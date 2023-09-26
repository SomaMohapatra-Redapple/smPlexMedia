const fs = require('fs');
const path = require('path');

const appConfig = require("../../config/appConfig");
//const auth = require('../middlewares/auth');
const validator = require('../../src/middlewares/validators/validator');
const microgamingController = require('../controllers/microgamingController');
// const { rateLimiter, rateLimiterByIP } = require('../../middlewares/rateLimiter');



module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/microgaming`;

  app.post(`${baseUrl}/:function`,validator.microgamingReqValidator,microgamingController.handler);
};

