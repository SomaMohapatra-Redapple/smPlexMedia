let checkLib = require('../libs/checkLib');
let mongoose = require('mongoose');
let ClientDbUserModel = mongoose.model('Client_db_users');
let ClientDbTransctionModel = mongoose.model('Client_db_transactions');


let userDetails = async (userId) => {
    try {
        let userData = await ClientDbUserModel.findOne({ _id: userId }).lean();
        if (checkLib.isEmpty(userData)) {
            return {
                error: true
            }
        } else {
            return {
                error: false,
                data: userData
            }
        }
    } catch (error) {
        console.log("error  => ", error.message)
        return {
            error: true
        }
    }
}

const insertLog = async (data) => {
    try {
        let transactionData = new ClientDbTransctionModel(data);
        let saveData = await transactionData.save();
        // console.log(saveData);
        if (saveData) {
            let insertData = {
                _id: saveData._id,
                error: false
            }
            return insertData;
        } else {
            let insertData = {
                error: true
            }
            return insertData;
        }

    } catch (e) {
        console.log('error ==>', e);
        return true;
    }
}

const updateBalance = async (user_id, transaction_amount, transaction_type) => {
    try {
        let userData = await getUser(user_id);
        if (!userData)
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
        return await ClientDbUserModel.findOneAndUpdate({ _id: id }, userData, { new: true });

    } catch (error) {
        return {
            error: true
        }
    }

}

const getUser = async (user_id) => {
    let user = await ClientDbUserModel.findById(user_id).lean();
    if (!checkLib.isEmpty(user)) {
        return user;
    }
    else {
        return false;
    }
}

const isTransactionProcessed = async (txn_id, transaction_type) => {
    let transaction = await ClientDbTransctionModel.findOne({ provider_transaction_id: txn_id, transaction_type : transaction_type }).lean();
    if (!checkLib.isEmpty(transaction)) {
        return true;
    } else {
        return false;
    }
}
module.exports = {
    userDetails: userDetails,
    insertLog: insertLog,
    updateBalance: updateBalance,
    isTransactionProcessed: isTransactionProcessed
}