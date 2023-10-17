let mongoose = require('mongoose');
const responseLib = require('../libs/responseLib');
let PlayerModel = mongoose.model('Player');
const clientTransactionModel = mongoose.model('Client_db_transactions');
const checkLib = require('../libs/checkLib')
const commonController = require('./commonController');

let userBalance = (req, res) => {
    try {
        // let findUserBalance = PlayerModel.find({ user_id: `${req.body.user_id}` }).lean();

        let payLoad = {
            currency: "kwr",
            amount: +1000,
            bonus : +100,
        }

        let apiResponse = responseLib.generate(false, "User Balance", payLoad);
        res.status(200).send(apiResponse);

    } catch (error) {
        let apiResponse = responseLib.generate(true, error.message, {});
        res.status(500).send(apiResponse);
    }
}

let authenticate = (req, res) => {
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

let bet = (req, res) => {
    try {
        // let findUserBalance = PlayerModel.find({ user_id: `${req.body.user_id}` }).lean();
        let payLoad = {};
        let rand = Math.floor(Math.random() * (3 - 1 + 1) + 1);
        switch(rand){
            case 1 :
                payLoad = {
                    
                    transaction_status : true,
                    available_balance: +1000,
                    code: 'SUCCEED',
                    currency: "kwr",
                    bonus : +100,
                    txn_id : req.body.txn_id,
                    operator_transaction_id : "123abcd85666",
                    round_id : req.body.round_id
                }
                break;
            case 2 :
                payLoad = {
                    transaction_status : false,
                    available_balance: +1000,
                    code: 'BALANCE_EXCEED',
                    currency: "kwr",
                    bonus : +100,
                    txn_id : req.body.txn_id,
                    operator_transaction_id : "123abcd85666",
                    round_id : req.body.round_id
                }
                break;
            case 3 :
                payLoad = {
                    transaction_status : false,
                    available_balance: +1000,
                    code: 'ALREADY_PROCESSED',
                    currency: "kwr",
                    bonus : +100,
                    txn_id : req.body.txn_id,
                    operator_transaction_id : "123abcd85666",
                    round_id : req.body.round_id
                }
                break;
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
        switch(rand){
            case 1 :
                payLoad = {
                    transaction_status : true,
                    available_balance: +1000,
                    code: 'SUCCEED',
                    currency: "kwr",
                    bonus : +100,
                    txn_id : req.body.txn_id,
                    operator_transaction_id : "123abcd85666",
                    round_id : req.body.round_id
                }
                break;
            case 2 :
                payLoad = {
                    transaction_status : false,
                    available_balance: +1000,
                    code: 'ALREADY_PROCESSED',
                    currency: "kwr",
                    bonus : +100,
                    txn_id : req.body.txn_id,
                    operator_transaction_id : "123abcd85666",
                    round_id : req.body.round_id
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

const rollback = async(req, res) => {
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
    handler : handler,
}