/**
 * 
 * @author Injamamul Hoque
 * @purpose microgaming provider integration common functions
 * @createdDate sep 26 2023
 * @lastUpdated sep 26 2023
 * 
 */

// module import
const mongoose = require('mongoose');
const playerModel = mongoose.model('Player');


/**
 * 
 * @author Injamamul Hoque
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