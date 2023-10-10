/**
 * 
 * @author Akash Paul
 * @purpose Pragmatic Play Other Wallet works integration and game launch related works
 * @createdDate Sep 25 2023
 * @lastUpdated Sep 25 2023
 * @lastUpdatedBy Akash Paul
 */

/** Modules Import */
const { config } = require("dotenv");
const axios = require("axios");
const appConfig = require("../../config/appConfig");
const commonController = require("./commonController");
const checkLib = require("../libs/checkLib");
let mongoose = require('mongoose');
let AccountsTechnicalsModel = mongoose.model('AccountsTechnicals');
let ClientProviderModel = mongoose.model('client_provider_mapping');
let PlayerModel = mongoose.model('Player');

/** Global Variables */


/**
 * 
 * @author Akash Paul
 * @function betControlStatus
 * @param {*} account_id, provider_id
 * @returns object
 * 
 */
let betControlStatus = async (account_id, provider_id) => {
    try {
        let maintenance_mode_status = "Y";
        let rejectionStatus = true;

        let acountDetails = await AccountsTechnicalsModel.findOne({ account_id: account_id }).lean();

        if (checkLib.isEmpty(acountDetails) == false) {

            maintenance_mode_status = acountDetails.is_maintenance_mode_on;
            let accountProviderTag = await ClientProviderModel.findOne({ account_id: account_id, client_id: acountDetails.client_id, provider_id: provider_id }).lean();

            if (checkLib.isEmpty(accountProviderTag) == false) {
                rejectionStatus = false;
            } else {
                rejectionStatus = true;
            }

            return {
                rejectionStatus: rejectionStatus,
                maintenance_mode_status: maintenance_mode_status
            }
        } else {
            return {
                rejectionStatus: true,
                maintenance_mode_status: "Y"
            }
        }
    } catch (e) {
        console.log('error ==>', e);
    }
}

module.exports = {
    betControlStatus: betControlStatus
};
