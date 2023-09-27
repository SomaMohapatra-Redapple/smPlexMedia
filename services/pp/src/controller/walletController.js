/**
 * 
 * @author Akash Paul
 * @purpose Evoplay Other Wallet works integration and game launch related works
 * @createdDate Jun 12 2023
 * @lastUpdated Jun 20 2023
 * @lastUpdatedBy Ritesh Das
 */

/** Modules Import */
const { config } = require("dotenv");
const axios = require("axios");
const appConfig = require("../../config/appConfig");
const commonController = require("./commonController");
const checkLib = require("../libs/checkLib");
let mongoose = require('mongoose');
let AccountsTechnicalsModel = mongoose.model('AccountsTechnicals');
let PlayerModel = mongoose.model('Player');

/** Global Variables */

this.revolution_provider_id = appConfig.revolution_provider_id;
this.pp_provider_id = appConfig.pp_provider_id;
this.bbin_provider_id = appConfig.bbin_provider_id;
this.okada_provider_id = appConfig.okada_provider_id;
this.revolution_provider_id = appConfig.revolution_provider_id;
this.dreamplay_provider_id = appConfig.dreamplay_provider_id;


let betControlStatus = async (usercode, account_id) => {
    try {
        let rejectionStatus = false;
        let maintenance_mode_status = "N";
        // let userCode = usercode;
        // let client_id = client_id;
        // let sql = `SELECT id FROM client_users_bet_rejection_list WHERE usercode='${usercode}'`;
        // let queryData = await dataAPI.query(sql, { type: dataAPI.QueryTypes.SELECT });
        ;
        let data = [{}]
        let acountDetails = await AccountsTechnicalsModel.findOne({ account_id: account_id }).lean();

        
        if (checkLib.isEmpty(data)) {
            rejectionStatus = true;
        }
        if (checkLib.isEmpty(acountDetails)) {
            maintenance_mode_status = queryData2[0].is_maintenance_mode_on;
        }
        return {
            rejectionStatus: rejectionStatus,
            maintenance_mode_status: maintenance_mode_status
        }

    } catch (e) {
        console.log('error ==>', e);
    }
}

module.exports = {
    betControlStatus: betControlStatus
};
