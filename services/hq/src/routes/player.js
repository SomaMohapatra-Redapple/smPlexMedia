const clientController = require("../controllers/player");
const appConfig = require("../../config/appConfig");
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validator")


module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}`;
    app.post(`${baseUrl}/add_player`,auth.isAuthorized,validation.addClient,clientController.add_player);
    app.post(`${baseUrl}/all_player`,auth.isAuthorized,clientController.all_player);
}