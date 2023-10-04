const jwt = require("jsonwebtoken");
const apiError = require("../libs/apiError");
const responseMessage = require("../libs/responseMessage");
// const client = require("../services/client");
// const { AddClient, FindAllClient, FindSpecificClient } = client;
const mongoose = require('mongoose');
const PlayerTable = mongoose.model('Player');

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

module.exports = {
  add_player : add_player,
  all_player : all_player
}