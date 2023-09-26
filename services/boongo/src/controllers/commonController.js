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

module.exports = {
    checkUsercodeExists : checkUsercodeExists
}