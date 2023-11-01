const jwt = require("jsonwebtoken");
const apiError = require("../libs/apiError");
//const responseMessage = require("../libs/responseMessage");
// const client = require("../services/client");
// const { AddClient, FindAllClient, FindSpecificClient } = client;
const mongoose = require('mongoose');
const PlayerTable = mongoose.model('Player');
const TransactionTable = mongoose.model("Transaction");
const responseMessage = require("../libs/responseMessage");
const responseLib = require("../libs/responseLib");
const ObjectId = mongoose.Types.ObjectId;

const AddPlayer = async (query) => {
  console.log("query", query);
  const player = await PlayerTable.create(query);
  console.log("player", player);
  return player;
};
const FindAllPlayer = async (validatedBody) => {
  console.log("validated body",validatedBody);
  
  const { e_mail, player_name, parent_player_id, contact, page, limit } =
    validatedBody;
  let query = {};
  if (player_name) {
    //query.player_name = new RegExp(player_name,"i");
    query.player_name = player_name;
  }
  if (parent_player_id) {
    query.parent_player_id = parent_player_id;
  }
  if (e_mail) {
    query.e_mail = e_mail;
  }
  if (contact) {
    query.contact = contact;
  }
  let options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 15,
    sort: { createdAt: -1 },
  };
  return await PlayerTable.paginate(query, options);
};
const FindSpecificPlayer = async (query) => {
  const player = await PlayerTable.findOne(query);
  return player;
};
const UpdatePlayerBalance = async (query, options) => {
  const balance = await PlayerTable.update(query, options);
  console.log("balance", balance);
  return balance;
};

//add player by client
let add_player = async (req,res,next) => {
  try{
    const query = req.body;
    const added_player = await AddPlayer(query)
    .then((result)=>{
      res.status(200).send({
        message : "player created",
        result : result
      })
    }).catch((err)=>{
      res.status(400).send({
        err : err.message,
      })

    })
  }
  catch(e){
    console.log("error",e);
    return next(e);
  }
};

//show player to client

let all_player = async(req,res,next) => {

}

//show player to player tab

let show_player_inside_account = async (req,res,next) => {
  try{

    const page = parseInt(req.query.page)||1; // Replace with your desired page number
    const perPage = parseInt(req.query.limit)||10; // Replace with the number of results per page

    // The "show_player" variable will contain an array with the sum of "transaction_amount" for the specified ID with the specified credit_type.
      

let show_player = await TransactionTable.aggregate([
  {
    $match: {
      "account_user_id": req.body.account_user_id,
    }
  },
  {
    $group: {
      _id: "$user_id",
      total_win: {
        $sum: {
          $cond: { if: { $eq: ["$transaction_type", "CREDIT"] }, then: { $toInt: "$transaction_amount" }, else: 0 }
        }
      },
      total_bet: {
        $sum: {
          $cond: { if: { $eq: ["$transaction_type", "DEBIT"] }, then: { $toInt: "$transaction_amount" }, else: 0 }
        }
      },
      
    },
    
  },
  {
    $project: {
      player_id: 1,
      total_win: 1,
      total_bet: 1,
      total_margin: { $subtract: ["$total_bet", "$total_win"] }
    }
  },
  {
    $addFields: {
      rtp: { $multiply: [{ $divide: ["$total_margin", "$total_bet"] }, 100] }
    }
  },
  {
    $project: {
      player_id: 1,
      total_win: 1,
      total_bet: 1,
      rtp: { $round: ["$rtp", 2] },
      
    }
  }
]);

    console.log("show_player",show_player);


    let apiResponse = responseLib.generate(false,"data fetch successfully",show_player);
    res.status(200).send(apiResponse);

  }
  catch(e){
    console.log("error",e);
  }
}

module.exports = {
  add_player : add_player,
  all_player : all_player,
  show_player_inside_account : show_player_inside_account
}