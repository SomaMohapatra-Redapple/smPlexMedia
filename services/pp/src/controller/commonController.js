/**
 * 
 * @author Akash Paul
 * @purpose PP provider integration common functions
 * @createdDate Sep 25 2023
 * @lastUpdated Sep 25 2023
 * @lastUpdatedBy Akash Paul
 */

const mongoose = require('mongoose');
const playerModel = mongoose.model('Player');
const TransactionModel = mongoose.model('Transaction');
const ProviderModel = mongoose.model('Provider');
const AccountsModel = mongoose.model('Accounts');
const ClientProviderAccountMappingModel = mongoose.model('client_provider_account_mapping');
const ProviderAccountModel = mongoose.model('provider_account');
const GameModel = mongoose.model('Game');
const appConfig = require('../../config/appConfig');
const checkLib = require('../libs/checkLib');
const redisLib = require('../libs/redisLib');

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
    if (providerdtls.length < 1 || providerdtls[0].accounts.length < 1)
        return false;
    else {

        providerdtls = providerdtls[0];

        let dataToSave = {
            id: providerdtls._id,
            name: providerdtls.game_provider_name,
            is_subprovider: providerdtls.is_subprovider,
        }

        providerdtls.accounts.forEach(element => {
            if (element.is_default) {
                dataToSave[`account-default`] = {
                    name: element.provider_account_name,
                    technical_details: element.technical_details,
                    is_default: element.is_default,
                    currency: element.currency,
                    game_category: element.game_category,
                }
            }
            else {
                dataToSave[`account-${element._id}`] = {
                    name: element.provider_account_name,
                    technical_details: element.technical_details,
                    is_default: element.is_default,
                    currency: element.currency,
                    game_category: element.game_category,
                }
            }
        })

        let added = await redisLib.add(`provider-${appConfig.provider_id}`, dataToSave);
        if (added)
            return true;
        else
            return false;
    }
}

const postDataFromAPI = async (apiUrl, endpoint, bodyData) => {
    try {
        let url = `${apiUrl}/callback?function=${endpoint}`;
        let requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bodyData // (JSON.stringify(bodyData))
        };
        console.log(bodyData)
        const data = await serverLib.server.getData(url, requestOptions);
        // console.log('API Response:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        let data = {
            err: true
        }
        return data;
    }
}

/**
 * 
 * @author Akash Paul
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

/**
 * 
 * @author Akash Paul
 * @function insertLog
 * @param {*} data
 * @returns userdtls/null
 * 
 */
const insertLog = async (data) => {
    try {
        let transactionData = new TransactionModel(data);
        let saveData = await transactionData.save();
        // console.log(saveData);
        if (saveData) {
            let insertData = {
                _id: saveData._id,
                error: false
            }
            return insertData;
        }
        else {
            let insertData = {
                erroe: true
            }
            return insertData;
        }

    } catch (e) {
        console.log('error ==>', e);
        return true;
    }
}

/**
 * 
 * @author Akash Paul
 * @function insertLog
 * @param {*} data
 * @returns object
 * 
 */
const checkUserOrRegister = async (account_user_id, account_id, currency, language) => {
    try {
        let plyr_details = await playerModel.findOne({
            account_id: account_id, account_user_id: account_user_id, currency_code: currency, language_code: language
        })
        if (checkLib.isEmpty(plyr_details)) {
            let newPlayer = new playerModel({
                account_id: account_id,
                account_user_id: account_user_id,
                currency_code: currency,
                language_code: language,
                status: "online"
            })
            let data = await newPlayer.save();
            return {
                error: false,
                data: data
            }
        } else {
            return {
                error: false,
                data: plyr_details
            }
        }

    } catch (error) {
        return {
            error: true,
            desc: error.message
        }
    }
}

/**
 * 
 * @author Akash Paul
 * @function insertLog
 * @param {*} provider_id, provider_account_id
 * @returns object
 * 
 */
const getProviderAccountTechnicals = async (provider_account_id) => {
    try {
        let providerId = `provider-${appConfig.provider_id}`;
        let accountsData = await redisLib.get(providerId);

        if (accountsData.error) {
            return {
                error: true
            }
        }

        // if the provider_account null we send the default provider account
        if (provider_account_id == null) {
            let payLoad = {
                error: false,
                data: accountsData.data[`account-default`]
            }
            return payLoad;
        }

        // if the provider_account_id has any value
        if (accountsData.hasOwnProperty(`account-${provider_account_id}`)) {
            let payLoad = {
                error: false,
                data: accountsData.data[`account-${provider_account_id}`]
            }
            return payLoad;
        } else {
            let payLoad = {
                error: false,
                data: accountsData.data[`account-default`]
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

/**
 * 
 * @author Akash Paul
 * @function insertLog
 * @param {*} account_id
 * @returns Boolean
 * 
 */
const isAccountExists = async (account_id) => {
    try {
        let accountdtls = await AccountsModel.findOne({ _id: account_id }).lean();
        if (checkLib.isEmpty(accountdtls) == false) {
            return {
                error: false,
                data: accountdtls
            }
        } else {
            return {
                error: true
            }
        }

    } catch (error) {
        return {
            error: true
        }
    }

}

/**
 * 
 * @author Akash Paul
 * @function insertLog
 * @param {*} provider_id, provider_account_id
 * @returns userdtls/null
 * 
 */
const getGameDetailsByGameId = async (game_id) => {
    try {
        let gamedtls = await GameModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(game_id)
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
        if (gamedtls.length > 0)
            return gamedtls[0];
        else
            return {};
    } catch (e) {
        console.log('error ==>', e);
        return {};
    }
}

/**
 * 
 * @author Akash Paul
 * @function insertLog
 * @param {*} provider_id, account_id
 * @returns userdtls/null
 * 
 */
const checkProviderAccountLink = async (account_id, provider_id) => {
    try {
        let providerAccount = await ClientProviderAccountMappingModel.findOne({ account_id: account_id, provider_id: provider_id }).lean();
        if (checkLib.isEmpty(providerAccount)) {
            return {
                error: false,
                data: null
            }
        }
        else {
            return {
                error: false,
                data: providerAccount.provider_account_id
            }
        }
    } catch (error) {
        return {
            error: true,
            message: error.message
        }
    }
}

let isHashvalid = async (parameter, client_id) => {

    let reqhash = '';
    let requestsend = {};
    let setdata = {};
    if (parameter.hasOwnProperty('hash')) {
        reqhash = parameter.hash;
        delete parameter.hash;
    }

    parameter = check.removeEmpty(parameter); // removing blank values

    parameter = check.sortObj(parameter); // sorting object
    let finalstring = httpBuildQuery(parameter) + setdata.key; //converting json to string
    let md5hash = check.createMd5hash(finalstring);

    if (md5hash != reqhash) {
        let errmsg = "Invalid hash code. Should be returned in the response on any request sent by Pragmatic Play if the hash code validation is failed.";
        requestsend = await invalidError(5, errmsg);
    }

    return requestsend;
}

module.exports = {
    setProviderInRedis: setProviderInRedis,
    checkUsercodeExists: checkUsercodeExists,
    insertLog: insertLog,
    postDataFromAPI: postDataFromAPI,
    checkUserOrRegister: checkUserOrRegister,
    getProviderAccountTechnicals: getProviderAccountTechnicals,
    isAccountExists: isAccountExists,
    getGameDetailsByGameId: getGameDetailsByGameId,
    checkProviderAccountLink: checkProviderAccountLink,
    isHashvalid: isHashvalid
}