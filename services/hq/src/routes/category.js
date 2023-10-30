const clientController = require("../controllers/client");
const appConfig = require("../../config/appConfig");
const auth = require("../middlewares/auth");
const validator = require("../middlewares/validator")
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
   console.log("base url ",baseUrl)
   app.get(`${baseUrl}/lang-list`,auth.isAuthorized,clientController.show_lang_list);
   app.post(`${baseUrl}/category-list`,validator.showCategoryValidate,auth.isAuthorized,clientController.show_category_list);
   app.post(`${baseUrl}/add-category`,validator.categoryValidate,auth.isAuthorized,clientController.add_category);
   app.post(`${baseUrl}/delete-category`,validator.editDeleteValidate,auth.isAuthorized,clientController.delete_category);
   app.post(`${baseUrl}/edit-category`,validator.editDeleteValidate,auth.isAuthorized,clientController.edit_category);
};
