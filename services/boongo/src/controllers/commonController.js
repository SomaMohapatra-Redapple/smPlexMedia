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
const ProviderModel = mongoose.model('Provider');
const checker = require('../libs/checkLib');
const redis = require('../libs/redisLib');
const appConfig = require('../../config/appConfig');
// const apiLib = require('../libs/apiLib');
const time = require('../libs/timeLib');
const AccountsModel = mongoose.model('Accounts');
const ClientproviderAccountMappingModel = mongoose.model('Client_provider_account_mapping');
const ProviderAccountModel = mongoose.model('Provider_account');

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
    return Math.floor(time.utc());
}

const isTransactionValid = async(transaction_id) => {
    let transactiondtls = await TransactionModel.findOne({ provider_transaction_id : transaction_id }).lean();
    if(checker.isEmpty(transactiondtls))
        return false;
    else
        return transactiondtls;
}

const setProviderInRedis = async () => {
    let provider_id = appConfig.provider_id;
    let providerdtls = await ProviderModel.aggregate(
        [
            {
              $match: {
                "_id": new mongoose.Types.ObjectId(provider_id)
              }
            },
            {
              $lookup: {
                from: "provider_accounts",
                localField: "_id",
                foreignField: "provider_id",
                as: "accounts"
              }
            }
        ]
    );
    if(providerdtls.length < 1 || providerdtls[0].accounts.length < 1)
        return false;
    else{
        
        providerdtls = providerdtls[0];

        let dataToSave = {
            id : providerdtls._id,
            name : providerdtls.game_provider_name,
            is_subprovider : providerdtls.is_subprovider,
        }

        providerdtls.accounts.forEach(element => {
            if(element.is_default){
                dataToSave[`account-default`] = {
                    name : element.provider_account_name,
                    technical_details : element.technical_details,
                    is_default : element.is_default,
                    currency : element.currency,
                    game_category : element.game_category,
                }
            }
            else{
                dataToSave[`account-${element._id}`] = {
                    name : element.provider_account_name,
                    technical_details : element.technical_details,
                    is_default : element.is_default,
                    currency : element.currency,
                    game_category : element.game_category,
                }
            }
        })

        let added = await redis.add(`provider-${provider_id}`, dataToSave);
        if(added)
            return true;
        else
            return false;
    }
}


const checkUserExistsOrRegister = async (account_user_id,account_id,currency,language)=>{

    try {
        let plyr_details = await playerModel.findOne({account_id: new mongoose.Types.ObjectId(account_id),account_user_id:account_user_id})
        if(checker.isEmpty(plyr_details)){
            let newPlayer = new playerModel({
                account_id: account_id,
                account_user_id: account_user_id,
                currency_code:currency,
                language_code:language,
                status:"online"
            })
            let data = await newPlayer.save();
            return {
                error:false,
                data:data
            }
        }else{
            return {
                error:false,
                data:plyr_details
            }
        }

    }catch (error) {
        console.log(error.message);
        return {
            error: true,
            desc:error
        }
    }
}

const isAccountExists = async(account_id) => {
    let accountdtls = await AccountsModel.findById(account_id).lean();
    if(checker.isEmpty(accountdtls))
        return false;
    else
        return true;
}

const checkProviderAccountLink = async(account_id, provider_id) => {
    try {
        let providerAccount = await ClientproviderAccountMappingModel.findOne({account_id: account_id, provider_id: provider_id}).lean();
        if(checker.isEmpty(providerAccount)){
            return {
                error : false,
                data : null
            }
        }
        else{
            return {
                error : false,
                data : providerAccount.provider_account_id
            }
        }
    } catch (error) {
        return {
            error : true,
            message : error.message
        }
    }
}

const getGameDetailsByGameId = async(game_id) => {
    try {
        let gamedtls = await GameModel.aggregate([
            {
              $match: {
                _id : new mongoose.Types.ObjectId(game_id)
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

const getProviderAccountTechnicals = async (provider_account_id) => {
    try {
        let provider_id = appConfig.provider_id;
        let providerId = `provider-${provider_id}`;
        let accountsData = await redis.get(providerId);
        // let accountsData = JSON.parse(providerAccountsData);
        // if the provider_account null we send the default provider account
        if(accountsData.error){
            return{
                error : true
            }
        }
        accountsData = accountsData.data;

        if (provider_account_id == null) {
            let payLoad = {
                error: false,
                data: accountsData[`account-default`]
            }
            return payLoad;
        }

        // if the provider_account_id has any value
        if (accountsData.hasOwnProperty(`account-${provider_account_id}`)) {
            let payLoad = {
                error: false,
                data: accountsData[`account-${provider_account_id}`]
            }
            return payLoad;
        } else {
            let payLoad = {
                error: false,
                data: accountsData[`account-default`]
            }
            return payLoad;
        }
    } catch (error) {
        let payLoad = {
            error: true,
            message: error.message
        }
        return payLoad;
    }
}

module.exports = {
    checkUsercodeExists : checkUsercodeExists,
    isBetEnabled : isBetEnabled,
    getGameDetailsByGameCode : getGameDetailsByGameCode,
    insertLog : insertLog,
    getVersion : getVersion,
    isTransactionValid: isTransactionValid,
    setProviderInRedis: setProviderInRedis,
    checkUserExistsOrRegister: checkUserExistsOrRegister,
    isAccountExists: isAccountExists,
    checkProviderAccountLink: checkProviderAccountLink,
    getGameDetailsByGameId: getGameDetailsByGameId,
    getProviderAccountTechnicals: getProviderAccountTechnicals
}