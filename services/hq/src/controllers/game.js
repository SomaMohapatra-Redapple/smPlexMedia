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
        
        const {page = 1,limit = 15} = req.query;
        let provider_id = req.body.provider_id;
        let sub_provider = req.body.sub_provider;
        let game_name = req.body.game_name;
        let game_code = req.body.game_code;
        let game_id = req.body.game_id;
 
        let data = {
            provider_id:provider_id,
            sub_provider:sub_provider,
            game_name:game_name,
            game_id:game_id,
            game_code:game_code,
            page:page,
            limit:limit
        }
        
        let gameDetails = await commonControllers.searchGames(data);
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

const gameEdit = async(req,res)=>{
    try {

        let gameData = req.body
        let updateData = await GameTable.findOneAndUpdate({_id:gameData.game_id},gameData,{new : true})
        let apiResponse = responseLib.generate(false,"game successfully updated",updateData)
        res.status(200).send(apiResponse)
        
    } catch (error) {
        let apiResponse = responseLib.generate(true,error.message,null)
        res.status(200).send(apiResponse)   
    }
};

const gameDelete = async(req,res)=>{
    try {

        let game_id = req.body.game_id;
        await GameTable.findByIdAndDelete(game_id);
        let apiResponse = responseLib.generate(false,"game deleted successfully",null)
        res.status(200).send(apiResponse);

    }catch(error){

        let apiResponse = responseLib.generate(false,error.message,null);
        res.status(403).send(apiResponse);
    }
};


module.exports = {
    providerList : providerList,
    gameList: gameList,
    gameEdit:gameEdit,
    gameDelete:gameDelete,
}
