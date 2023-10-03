/**
 * 
 * @author Rajdeep Adhikary
 * @purpose Boongo provider integration common functions
 * @createdDate Sep 26 2023
 * @lastUpdated Sep 26 2023
 * @lastUpdatedBy Rajdeep Adhikary
 */

const mongoose = require('mongoose');
const playerModel = mongoose.model('Player');
const AccountsTechnicalsModel = mongoose.model('AccountsTechnicals');
const ClientProviderModel = mongoose.model('Client_provider_mapping');
const GameModel = mongoose.model('Game');
const TransactionModel = mongoose.model('Transaction');
const checker = require('../libs/checkLib');

/**
 * 
 * @author Rajdeep Adhikary
 * @function checkUsercodeExists
 * @param {*} usercode
 * @returns userdtls/null
 * 
 */
const checkUsercodeExists = async (usercode) => {
    try {
        let user = await playerModel.findById(usercode).lean();
        return user;
    } catch (error) {
        return null;
    }
}

const isBetEnabled = async (account_id, provider_id) => {
    try {
        let maintenance_mode_status = "Y";
        let rejectionStatus = true;

        let acountDetails = await AccountsTechnicalsModel.findOne({ account_id: account_id }).lean();

        if (checker.isEmpty(acountDetails) == false) {

            maintenance_mode_status = acountDetails.is_maintenance_mode_on;
            let accountProviderTag = await ClientProviderModel.findOne({ account_id: account_id, client_id: acountDetails.client_id, provider_id: provider_id }).lean();

            if (checker.isEmpty(accountProviderTag) == false) {
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
        return {
            rejectionStatus: true,
            maintenance_mode_status: "Y"
        }
    }
}

const getGameDetailsByGameCode = async(gamecode, provider_id) => {
    try {
        let gamedtls = await GameModel.aggregate([
            {
              $match: {
                game_code : gamecode,
                game_provider_id : new mongoose.Types.ObjectId(provider_id)
              }
            },
            {
              $lookup: {
                from: "categories",
                localField: "game_category_id",
                foreignField: "_id",
                as: "categorydtls"
              }
            },
            {
              $unwind: "$categorydtls"
            }
          ]);
          if(gamedtls.length > 0)
            return gamedtls[0];
          else
            return {};
    } catch (e) {
        console.log('error ==>', e);
        return {};
    }
}

const insertLog = async(data) => {
    try {
        let transactionData = new TransactionModel(data);
        let saveData = await transactionData.save();
        if(saveData)
            return true;
        else
            return false;
    } catch (e) {
        console.log('error ==>', e);
    }
}

const getVersion = async() => {
    return Math.floor(Date.now() / 1000);
}

const isTransactionValid = async() => {
    
}

module.exports = {
    checkUsercodeExists : checkUsercodeExists,
    isBetEnabled : isBetEnabled,
    getGameDetailsByGameCode : getGameDetailsByGameCode,
    insertLog : insertLog,
    getVersion : getVersion,
}