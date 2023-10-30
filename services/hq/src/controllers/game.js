const mongoose = require("mongoose");
const ClientTable = mongoose.model("Client");
const ProviderTable = mongoose.model("Provider");
const GameTable = mongoose.model("Game");
const checkLib = require("../libs/checkLib")
const commonControllers = require("../controllers/common");

const responseLib = require('../libs/responseLib')


/**
 * 
 * @author Injamamul Hoque
 * @function providerList
 * @param {*} req,res
 * @returns list of providers
 * @created_at 27.10.2023
 * 
 */

const providerList = async(req,res)=>{
    try {

        let provider_list = await ProviderTable.find({});
        if(!checkLib.isEmpty(provider_list)){

            let apiResponse = responseLib.generate(false,"data fetched successfully",provider_list);
            res.status(200).send(apiResponse);

        }else{
            throw new Error("couldn't find provider")
        }
        
    } catch (error) {

        let apiResponse = responseLib.generate(true,error.message,null);
        res.status(403).send(apiResponse);
    }
}


/**
 * 
 * @author Injamamul Hoque
 * @function providerList
 * @param {*} req,res
 * @returns list of games
 * @created_at 27.10.2023
 * 
 */

const gameList = async(req,res)=>{
    try {

        let providerName = req.body.provider;
        let subProvider = req.body.sub_provider;
        let gameParams = {
            game_name : req.body.game_name,
            game_code : req.body.game_code,
            game_id : req.body.game_id
        }

        let gameDetails = await commonControllers.searchGames(providerName,subProvider,gameParams);
        if(!checkLib.isEmpty(gameDetails)){

            let apiResponse = responseLib.generate(false,"data fetched successfully",gameDetails)
            res.status(200).send(apiResponse);

        }else{
            throw new Error("Game not found")
        }
        
        
    } catch (error) {

        let apiResponse = responseLib.generate(true,error.message,null);
        res.status(403).send(apiResponse);
        
    }
    

};


module.exports = {
    providerList : providerList,
    gameList: gameList
}
