const mongoose = require("mongoose");
const ClientTable = mongoose.model("Client");
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


module.exports = {
    find_level: find_level
}
