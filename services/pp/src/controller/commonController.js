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
const apiLib = require('../libs/apiLib');

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
        const api = new apiLib(apiUrl);
        const data = await api.postData(endpoint, bodyData);
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


module.exports = {
    setProviderInRedis: setProviderInRedis,
    checkUsercodeExists: checkUsercodeExists,
    insertLog: insertLog,
    postDataFromAPI: postDataFromAPI
}