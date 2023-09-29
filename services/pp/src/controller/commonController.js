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
        console.log(saveData);
        if (saveData) {
            let insertData = {
                erroe: false
            }
            return insertData;
        }

        else {
            let insertData = {
                erroe: false
            }
            return insertData;
        }

    } catch (e) {
        console.log('error ==>', e);
        return false;
    }
}


module.exports = {
    checkUsercodeExists: checkUsercodeExists,
    insertLog: insertLog
}