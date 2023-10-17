<<<<<<< HEAD

/**
 * 
 * @author Injamamul Hoque
=======
/**
 * 
 * @author Rajdeep Adhikary
>>>>>>> 9557c544e54330cfffc82c4294dfd182f678cc36
 * @purpose Client API integration common functions
 * @createdDate Oct 17 2023
 * @lastUpdated Oct 17 2023
 * @lastUpdatedBy Rajdeep Adhikary
 */

const mongoose = require('mongoose');
<<<<<<< HEAD
const checkLib = require('../libs/checkLib');
=======
const checker = require('../libs/checkLib');
>>>>>>> 9557c544e54330cfffc82c4294dfd182f678cc36
const appConfig = require('../../config/appConfig');
// const apiLib = require('../libs/apiLib');
// const time = require('../libs/timeLib');
const ClientDbUsersModel = mongoose.model('Client_db_users');

/**
 * 
<<<<<<< HEAD
 * @author Injamamul Hoque
 * @function getUser
  @param {} user_id
=======
 * @author Rajdeep Adhikary
 * @function getUser
 * @param {*} user_id
>>>>>>> 9557c544e54330cfffc82c4294dfd182f678cc36
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

<<<<<<< HEAD
const updateBalance = async (user_id, transaction_amount, transaction_type) => {
    try {
        let userData = await getUser(user_id);
        if(!userData)
            return { error: true };
        let id = userData._id;
        if (transaction_type == "CREDIT") {
            userData.balance = parseFloat(userData.balance) + parseFloat(transaction_amount)
        }
        if (transaction_type == "DEBIT") {
            userData.balance = parseFloat(userData.balance) - parseFloat(transaction_amount)
        }
        delete userData._id;
        console.log(userData);
        return await ClientDbUserModel.findOneAndUpdate({_id: id}, userData, {new: true});
        
    } catch (error) {
        return {
            error: true
        }
    }

}

module.exports = {
    getUser: getUser,
    updateBalance: updateBalance
=======
module.exports = {
    getUser: getUser,
>>>>>>> 9557c544e54330cfffc82c4294dfd182f678cc36
}