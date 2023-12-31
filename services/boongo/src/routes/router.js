const fs = require('fs');
const path = require('path');

const appConfig = require("../../config/appConfig");
const auth = require('../middlewares/auth');
const validator = require('../middlewares/validators/validator');
// const { rateLimiter, rateLimiterByIP } = require('../../middlewares/rateLimiter');
const boongoController = require("../controllers/boongoController");


module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/boongo`;

  app.post(`${baseUrl}/getgameurl`, validator.getGameValidator, boongoController.getGameUrl);
  app.post(`${baseUrl}`, auth.isAuthorized, validator.boongoReqValidator, boongoController.handler);
};

