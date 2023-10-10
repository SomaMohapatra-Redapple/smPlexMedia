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
const appConfig = require('../../config/appConfig');
const checkLib = require('../libs/checkLib');
const serverLib = require('../libs/serverLib');

const setProviderInRedis = async () => {
    let { redisClient } = require('../../www/db/db');
    try {
        let provider_id = appConfig.provider_id;
        let providerdtls = await ProviderModel.findById(provider_id);
        if (checkLib.isEmpty(providerdtls))
            return false;
        else {
            await redisClient.set('provider_pp', JSON.stringify(providerdtls));
            return true;
        }
    } catch (error) {
        console.log("redis data storing erroe ===> ", error.message);
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
            data: bodyData
        };
        const data = await serverLib.server.getData(url, requestOptions);
        console.log('API Response:', data);
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
 * @returns userdtls/null
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


module.exports = {
    setProviderInRedis: setProviderInRedis,
    checkUsercodeExists: checkUsercodeExists,
    insertLog: insertLog,
    postDataFromAPI: postDataFromAPI,
    checkUserOrRegister: checkUserOrRegister
}