const playerController = require("../controllers/player");
const appConfig = require("../../config/appConfig");
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validator")


module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}/player`;
    //app.post(`${baseUrl}/add_player`,auth.isAuthorized,validation.addClient,playerController.add_player);
    app.post(`${baseUrl}/all_player`,auth.isAuthorized,playerController.all_player); //show_player_inside_account
    app.post(`${baseUrl}/show_player_inside_account`,auth.isAuthorized,playerController.show_player_inside_account);
}