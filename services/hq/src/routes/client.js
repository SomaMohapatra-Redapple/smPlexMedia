const clientController = require("../controllers/client");
const appConfig = require("../../config/appConfig");
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validator")

module.exports.setRouter = (app) => {
  let baseUrl = `${appConfig.apiVersion}`;
   app.post(`${baseUrl}/add_client`,auth.isAuthorized,validation.addClient,clientController.add_client);
   app.post(`${baseUrl}/all_client`,auth.isAuthorized,clientController.all_client);
   app.post(`${baseUrl}/log_in`,validation.loginValidate,clientController.log_in);
   app.post(`${baseUrl}/add_client_by_client`,auth.isAuthorized,validation.addClient,clientController.add_client_by_client);
};
