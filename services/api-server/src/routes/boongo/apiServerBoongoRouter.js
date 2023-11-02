const appConfig = require("../../../config/appConfig");
const controller = require('../../controllers/boongo/apiServerBoongoController');

module.exports.setRouter = (app) => {

  let baseUrl = `${appConfig.apiVersion}/boongo`;

  app.post(`${baseUrl}`,controller.handler);
};