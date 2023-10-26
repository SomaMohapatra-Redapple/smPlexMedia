const clientController = require("../controllers/account");
const appConfig = require("../../config/appConfig");
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validator")
//const rateLimit = require("../middlewares/rateLimiter");

module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}`;
//   app.post (`${baseUrl}/withdraw_balance`,auth.isAuthorized,betController.withdraw_balance);
   app.post(`${baseUrl}/add_account`,validation.addAccountValidation,auth.isAuthorized,clientController.add_account);
   //app.post(`${baseUrl}/add_account_techicals`,validation.addAccountTechnicalValidation,auth.isAuthorized,clientController.add_account_techicals);
   app.post(`${baseUrl}/show_account`,auth.isAuthorized,clientController.show_account);
   app.post(`${baseUrl}/update_account`,auth.isAuthorized,clientController.update_account);
};
