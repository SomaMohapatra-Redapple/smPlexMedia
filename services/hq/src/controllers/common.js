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

const searchGames = async (providerName, subProvider, gameParams) => {
    let query = {};
  
    if (providerName) {
      query.provider_name = providerName;
    }
  
    if (subProvider) {
      query.sub_provider = subProvider;
    }
  
    if (gameParams) {
      if (gameParams.game_name) {
        query.game_name = gameParams.game_name;
      }
  
      if (gameParams.game_code) {
        query.game_code = gameParams.game_code;
      }
  
      if (gameParams.game_id) {
        query.game_id = gameParams.game_id;
      }
    }
  
    const results = await GameTable.find(query);
    return results;
  };
  


module.exports = {
    find_level: find_level,
    searchGames: searchGames
}
