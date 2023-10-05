const clientController = require("../controllers/admin");
const appConfig = require("../../config/appConfig");
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validator");

module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    app.post(`${baseUrl}/admin_login`,validation.loginValidate,clientController.admin_login);
    app.post(`${baseUrl}/add_admin`,auth.isAuthorized,validation.loginValidate,clientController.add_admin);
}