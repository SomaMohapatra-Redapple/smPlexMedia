let mongoose = require('mongoose');
const responseLib = require('../libs/responseLib');
const timeLib = require('../libs/timeLib');
let PlayerModel = mongoose.model('Player');
const clientTransactionModel = mongoose.model('Client_db_transactions');
const checkLib = require('../libs/checkLib')
const commonController = require('./commonController');

let userBalance = async (req, res) => {
    try {
        let userData = await commonController.userDetails(req.body.user_id);

        if (userData.error == true) {
            let apiResponse = responseLib.generate(true, "Invalid User", {});
            return res.status(500).send(apiResponse);
        }

        let payLoad = {
            currency: userData.data.currency_code,
            amount: parseFloat(userData.data.balance),
            bonus: 1000.50
        }

        let apiResponse = responseLib.generate(false, "User Details", payLoad);
        res.status(200).send(apiResponse);
    } catch (error) {
        let apiResponse = responseLib.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

let authenticate = async(req, res) => {
    try {
        // let findUserBalance = PlayerModel.find({ user_id: `${req.body.user_id}` }).lean();

        let payLoad = {
            currency: "kwr",
            amount: +1000,
            bonus : +100,
            country : "GB",
            jurisdiction : "UK"
        }

        let apiResponse = responseLib.generate(false, "User Authenticated", payLoad);
        res.status(200).send(apiResponse);

    } catch (error) {
        let apiResponse = responseLib.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

let bet = async (req, res) => {
    try {
        // get user from db
        let userData = await commonController.userDetails(req.body.user_id);
        let payLoad = {};

        // if user doen't exist, return
        if (userData.error == true) {
            let apiResponse = responseLib.generate(true, "INVALID_USER", {});
            return res.status(500).send(apiResponse);
        }

        // check if bet is greater than user's balance

        if (parseFloat(userData.data.balance) < parseFloat(req.body.bet_amount)) {
            payLoad = {
                transaction_status: false,
                available_balance: parseFloat(userData.data.balance),
                code: 'BALANCE_EXCEED',
                currency: userData.data.currency_code,
                bonus: +100,
                txn_id: req.body.txn_id,
                operator_transaction_id: "",
                round_id: req.body.round_id
            }
            let apiResponse = responseLib.generate(false, "BALANCE_EXCEED", payLoad);
            return res.status(200).send(apiResponse);
        }

        if(await commonController.isTransactionProcessed(req.body.txn_id)){
            payLoad = {
                transaction_status: false,
                available_balance: parseFloat(userData.data.balance),
                code: 'ALREADY_PROCESSED',
                currency: userData.data.currency_code,
                bonus: +100,
                txn_id: req.body.txn_id,
                operator_transaction_id: "",
                round_id: req.body.round_id
            }
            let apiResponse = responseLib.generate(false, "ALREADY_PROCESSED", payLoad);
            return res.status(200).send(apiResponse);
        }
                
        await commonController.updateBalance(req.body.user_id, req.body.bet_amount, "DEBIT");

        let logData = {
            session_id: "00000",
            user_id: req.body.user_id,
            game_id: req.body.game_id,
            provider_id: "0123456789",
            provider_transaction_id: req.body.txn_id,
            game_category_id: req.body.category_id,
            round_id: req.body.round_id,
            transaction_amount: parseFloat(req.body.bet_amount),
            transaction_type: "DEBIT",
            available_balance: parseFloat(userData.data.balance) - parseFloat(req.body.bet_amount),
            action: "BET",
            status: true,
            created_at: timeLib.now(),
            updated_at: timeLib.now()
        }

        // log the data
        let inserData = await commonController.insertLog(logData);
        payLoad = {
            transaction_status: true,
            available_balance: parseFloat(userData.data.balance) - parseFloat(req.body.bet_amount),
            code: 'SUCCEED',
            currency: userData.data.currency_code,
            bonus: parseFloat(100.125),
            txn_id: req.body.txn_id,
            operator_transaction_id: inserData._id,
            round_id: req.body.round_id
        }

        let apiResponse = responseLib.generate(false, "Bet API", payLoad);
        res.status(200).send(apiResponse);

    } catch (error) {
        let apiResponse = responseLib.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

let win = (req, res) => {
    try {
        // let findUserBalance = PlayerModel.find({ user_id: `${req.body.user_id}` }).lean();
        let payLoad = {};
        let rand = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        console.log(rand);
        switch (rand) {
            case 1:
                payLoad = {
                    transaction_status: true,
                    available_balance: +1000,
                    code: 'SUCCEED',
                    currency: "kwr",
                    bonus: +100,
                    txn_id: req.body.txn_id,
                    operator_transaction_id: "123abcd85666",
                    round_id: req.body.round_id
                }
                break;
            case 2:
                payLoad = {
                    transaction_status: false,
                    available_balance: +1000,
                    code: 'ALREADY_PROCESSED',
                    currency: "kwr",
                    bonus: +100,
                    txn_id: req.body.txn_id,
                    operator_transaction_id: "123abcd85666",
                    round_id: req.body.round_id
                }
                break;
        }


        let apiResponse = responseLib.generate(false, "Win API", payLoad);
        res.status(200).send(apiResponse);

    } catch (error) {
        let apiResponse = responseLib.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

const rollback = async (req, res) => {
    try {

        let trans_details = await clientTransactionModel.findOne({provider_transaction_id : req.body.txn_id});

        let user_detials = await commonController.getUser(req.body.user_id)

        if(!checkLib.isEmpty(trans_details)){


            let new_trans_details = new clientTransactionModel({
                session_id : trans_details.session_id,
                user_id : trans_details.user_id,
                game_id : trans_details.game_id,
                provider_id : trans_details.provider_id,
                provider_transaction_id : req.body.txn_id,
                game_category_id : trans_details.game_category_id,
                round_id : trans_details.round_id,
                transaction_amount : req.body.amount,
                transaction_type : "CREDIT",
                available_balance : user_detials.balance + req.body.amount,
                action : 'REFUND',
                status : trans_details.status
            })

            let transaction_log = await new_trans_details.save();

            user_detials.balance = transaction_log.balance
            
            await user_detials.save();


            let payLoad = {
                available_balance : transaction_log.available_balance,
                txn_id : req.body.txn_id,
                operator_transaction_id: transaction_log._id,
                currency : user_detials.currency,
                bonus : +100
            }

            let apiResponse = responseLib.generate(false, "Rollback", payLoad);
            res.status(200).send(apiResponse);



        }else{

            let payLoad = {
                available_balance : user_detials.balance,
                txn_id : req.body.txn_id,
                operator_transaction_id: null,
                currency : user_detials.currency,
                bonus : 0
            }

            let apiResponse = responseLib.generate(false, "Rollback", payLoad);
            res.status(200).send(apiResponse);


        }
        // let findUserBalance = PlayerModel.find({ user_id: `${req.body.user_id}` }).lean();
        // let payLoad = {};
        // let rand = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        // switch(rand){
        //     case 1 :
        //         payLoad = {
        //             available_balance: +1000,
        //             txn_id : req.body.txn_id,
        //             operator_transaction_id : "123abcd85666",
        //             currency: "kwr",
        //             bonus : +100,
        //         }
        //         break;
        //     case 2 :
        //         payLoad = {
        //             available_balance: +1000,
        //             txn_id : req.body.txn_id,
        //             operator_transaction_id : "123abcd85666",
        //             currency: "kwr",
        //             bonus : +100,
        //         }
        //         break;
        // }
        

        // let apiResponse = responseLib.generate(false, "Rollback", payLoad);
        // res.status(200).send(apiResponse);

    } catch (error) {
        let apiResponse = responseLib.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

let handler = (req, res) => {
    try {
        const functionName = req.query.function;
        switch (functionName) {
            case "balance":
                userBalance(req, res);
                break;
            case "authenticate":
                authenticate(req, res);
                break;
            case "bet":
                bet(req, res);
                break;
            case "win":
                win(req, res);
                break;
            case "refund":
                rollback(req, res);
                break;
            default:
                res.status(404).send({});
                break;
        }
    } catch (error) {
        res.status(403).send({});
    }
}

module.exports = {
    handler: handler,
}