const clientController = require("../controllers/client");
const gameController = require("../controllers/game");
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
 * @updated_at 27.10.2023
 */

module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}`;
   app.post(`${baseUrl}/search_client_user`,validation.searchValidate,auth.isAuthorized,clientController.search_client_user);
   app.get(`${baseUrl}/provider-list`,auth.isAuthorized,gameController.providerList); 
   app.post(`${baseUrl}/game-list`,validation.gameListValidate,auth.isAuthorized,gameController.gameList);
};
