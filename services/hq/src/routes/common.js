const clientController = require("../controllers/client");
const appConfig = require("../../config/appConfig");
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validator")
//const rateLimit = require("../middlewares/rateLimiter");

/**
 * 
 * @author Injamamul Hoque
 * @function setRouter
 * @param {*} req res
 * @returns res
 * @created_at 19.10.2023
 * 
 */

module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}`;
//   app.post (`${baseUrl}/withdraw_balance`,auth.isAuthorized,betController.withdraw_balance);
   app.post(`${baseUrl}/search_client_user`,validation.searchValidate,auth.isAuthorized,clientController.search_client_user);
   
};
