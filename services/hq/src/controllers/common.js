const mongoose = require("mongoose");
const ClientTable = mongoose.model("Client");
const GameTable = mongoose.model("Game");
const responseLib = require('../libs/responseLib')


/**
 * 
 * @author Injamamul Hoque
 * @function find_level
 * @param {*} user_details
 * @returns array of objects
 * @created_at 19.10.2023
 * 
 */

const find_level = async(user_details)=>{
    try {

        
        let arr = [];
        while(user_details.parent_client_id != null){
  
             user_details = await ClientTable.findOne({"_id":user_details.parent_client_id});

    
            arr.push({ 
                client_user_name: user_details.username,
                client_name: user_details.client_name
            })
        }

        return arr.reverse();
        
    } catch (error) {
        return error.message;
    }
    
}


/**
 * 
 * @author Injamamul Hoque
 * @function searchGames
 * @param {*} providerName,subProvider,gameParams
 * @returns game details
 * @created_at 27.10.2023
 * 
 */

const searchGames = async (data) => {
    let query = {};
    let page = data.page;
    let limit = data.limit;
  
    if (data.game_provider_id) {
      query.game_provider_id = data.provider_id;
    }
  
    if (data.sub_provider) {
      query.sub_provider = data.sub_provider;
    }

    if (data.game_name) {
      query.game_name = data.game_name;
    }

    if (data.game_code) {
      query.game_code = data.game_code;
    }

    if (data.game_id) {
      query.game_id = data.game_id;
    }
    
  
    const gameDetails = await GameTable.find(query)
    .populate({
      path:'game_category_id',
      model:'Category'
    })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

    console.log("gamedetais ...",gameDetails);

    const count = await GameTable.count();

    let results = {
      gameDetails: gameDetails,
      limit:limit,
      page:page,
      pages: Math.ceil(count/limit),
      total:count
     }
    return results;

  };
  


module.exports = {
    find_level: find_level,
    searchGames: searchGames
}
