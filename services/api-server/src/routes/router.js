const fs = require('fs');
const path = require('path');

const appConfig = require("../../config/appConfig");
const apiController = require('../controllers/apiController')


module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/plexmedia`;
  app.get(`${baseUrl}`, apiController.test);

  //app.post(`${baseUrl}/:function`,validator.ppReqValidator, ppSlotController.handler);
};

