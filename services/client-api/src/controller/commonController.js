/**
 * 
 * @author Rajdeep Adhikary
 * @purpose Client API integration common functions
 * @createdDate Oct 17 2023
 * @lastUpdated Oct 17 2023
 * @lastUpdatedBy Rajdeep Adhikary
 */

const mongoose = require('mongoose');
const checker = require('../libs/checkLib');
const appConfig = require('../../config/appConfig');
// const apiLib = require('../libs/apiLib');
// const time = require('../libs/timeLib');
const ClientDbUsersModel = mongoose.model('Client_db_users');

/**
 * 
 * @author Rajdeep Adhikary
 * @function getUser
 * @param {*} user_id
 * @returns userdtls/null
 * 
 */

const getUser = async (user_id) => {
    let user = await ClientDbUsersModel.findById(user_id).lean();
    if(!checker.isEmpty(user)){
        return user;
    }
    else{
        return false;
    }
}

module.exports = {
    getUser: getUser,
}