const timeLIb = require("../libs/timeLib");
const jwt = require("jsonwebtoken");
const apiError = require("../libs/apiError");
const checkLib = require("../libs/checkLib");
const responseLib = require("../libs/responseLib");
const commonControllers = require('./common')
const responseMessage = require("../libs/responseMessage");
// const client = require("../services/client");
// const { AddClient, FindAllClient, FindSpecificClient } = client;
const db = require("../../config/config.json");
console.log("db", db.development.database);
var data = db.development.database;
const mongoose = require("mongoose");
const ClientTable = mongoose.model("Client");
const PlayerTable = mongoose.model("Player");
const AdminTable = mongoose.model("SuperAdmin");

const AddClient = async (query) => {
  console.log("query", query);
  //query.raw = true;
  const client = await ClientTable.create(query);
  console.log("client", client);
  return client;
};
const FindAllClient = async (validatedBody) => {
  console.log("validated body", validatedBody);

  const { id, e_mail, client_name, parent_client_id, contact, page, limit } =
    validatedBody;
  let query = {};
  if (id) {
    //query.client_name = new RegExp(client_name,"i");
    _id = id;
  }
  if (client_name) {
    //query.client_name = new RegExp(client_name,"i");
    query.client_name = client_name;
  }
  if (parent_client_id) {
    query.parent_client_id = parent_client_id;
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
  console.log("query",query);
  return await ClientTable.paginate(query, options);
};
const FindSpecificClient = async (query) => {
  const client = await ClientTable.findOne(query);
  return client;
};
const FindSpecificClientFromClient = async (query) => {
  const client = await ClientTable.findOne(query);
  return client;
};
const FindSpecificAdminFromAdmin = async (query) => {
  const client = await AdminTable.findOne(query);
  return client;
};
const UpdateClientBalance = async (query, options) => {
  const balance = await ClientTable.update(query, options);
  console.log("balance", balance);
  return balance;
};

//add client by super admin
let add_client = async (req, res, next) => {
  try {


    
    console.log("req.headers.token", req.headers.token);
    console.log("req.body.value", req.body);
    req.body.created_by = req.user.id;
    const query = req.body;
    req.body.parent_client_id = req.user.id;
    req.body.client_name = req.body.firstname + " " + req.body.lastname;
    query.created_at = timeLIb.now();
    query.updated_at = timeLIb.now();
    const requester = req.connection.remoteAddress.slice(0, 9);
    const added_client = await AddClient(query)
      .then((result) => {
        (async () => {
          const all_client = await FindAllClient(req.query);
          console.log("all_client", all_client);
        })();

        res.status(200).send({
          message: "client created",
          result: result,
          requester: requester,
        });
      })
      .catch((err) => {
        res.status(400).send({
          err: err.message,
        });
      });
  } catch (e) {
    console.log("error", e);
    return next(e);
  }
};

//add client by client
const add_client_by_client = async (req, res, next) => {
  try {
    req.body.created_by = req.user.id;
    const query = req.body;
    const added_client = await AddClient(query)
      .then((result) => {
        res.status(200).send({
          message: "client created",
          result: result,
        });
      })
      .catch((err) => {
        res.status(400).send({
          err: err.message,
        });
      });
    console.log("added_client.error", added_client);
  } catch (e) {
    console.log("error", e);
  }
};

//find all client


// const all_client = async (req, res, next) => {
//   try {
//     let allClient;
//     let query;

//     if (!req.body.parent_client_id) {
//       query = { parent_client_id: req.user.id };
//     } else {
//       query = { parent_client_id: req.body.parent_client_id };
//     }

//     allClient = await FindAllClient(query);
//     allClient = JSON.parse(JSON.stringify(allClient));

//     if (allClient.docs.length > 0) {
//       let upper_level = "admin";

//       if (req.body.parent_client_id) {
//         const client_detail = await FindSpecificClientFromClient({
//           _id: req.body.parent_client_id,
//         });
//         upper_level = client_detail.client_name;
//       }

//       for (let client of allClient.docs) {
//         const fieldsToDelete = [
//           "contact",
//           "email",
//           "password",
//           "status",
//           "environment",
//           "created_by",
//           "updated_by",
//           "updated_at",
//           "__v",
//         ];

//         for (const field of fieldsToDelete) {
//           delete client[field];


// let all_client = async (req,res,next) => {
//   try{
//     let allClient;
//     if(!req.body.parent_client_id)
//     {
//       const query_for_all_client_of_logged_in = {parent_client_id : req.user.id}
//       allClient = await FindAllClient(query_for_all_client_of_logged_in);
//       allClient = JSON.parse(JSON.stringify(allClient));
//       let length = allClient.docs.length;
//       if(length>0){
//           for (let client of allClient.docs) {
//           delete client.contact;
//           delete client.email;
//           delete client.password;
//           delete client.status;
//           delete client.environment;
//           delete client.created_by;
//           delete client.updated_by;
//           delete client.updated_at;
//           delete client.__v;
//           client.upper_level = "admin";
//           client.slno = allClient.docs.indexOf(client) + 1;
//           client.balance = 0;
//           client.currency = "KRW";
//           //console.log("client", client);
//         }
  
//         res.status(200).send({
//           result : allClient,
//           message : "all client found"
//         })

//         client.upper_level = upper_level;
//         client.slno = allClient.docs.indexOf(client) + 1;
//         client.balance = 0;
//         client.currency = "KRW";
//       }

//       res.status(200).send({
//         result: allClient,
//         message: "all client found",
//       });
//     } else {
//       res.status(400).send({
//         result: allClient,
//         message: "no client found under this id",
//       });
//     }
//   } catch (e) {
//     console.log("error from all_client", e);
//   }
// };


let all_client = async (req,res,next) => {
  try{
    let allClient;
    if(!req.body.parent_client_id)
    {
      const query_for_all_client_of_logged_in = {parent_client_id : req.user.id};
      query_for_all_client_of_logged_in.page = req.query.page;
      query_for_all_client_of_logged_in.limit = req.query.limit;
      allClient = await FindAllClient(query_for_all_client_of_logged_in);
      allClient = JSON.parse(JSON.stringify(allClient));
      let length = allClient.docs.length;
      if(length>0){
          for (let client of allClient.docs) {
          delete client.contact;
          delete client.email;
          delete client.password;
          delete client.status;
          delete client.environment;
          delete client.created_by;
          delete client.updated_by;
          delete client.updated_at;
          delete client.__v;
          client.upper_level = "admin";
          client.slno = allClient.docs.indexOf(client) + 1;
          client.balance = 0;
          client.currency = "KRW";
          //console.log("client", client);
        }
  
        res.status(200).send({
          result : allClient,
          message : "all client found"
        })

      }
      else{
        res.status(400).send({
          message:"no client under this id"
        })
      }
    }
    else if(req.body.parent_client_id){
      const query_for_all_client_of_nested_client = {parent_client_id : req.body.parent_client_id};
      query_for_all_client_of_nested_client.page = req.query.page;
      query_for_all_client_of_nested_client.limit = req.query.limit;
      allClient = await FindAllClient(query_for_all_client_of_nested_client);
      allClient = JSON.parse(JSON.stringify(allClient));
      console.log("allClient",allClient);
      console.log("allClient.docs.length",allClient.docs.length);
      let length = allClient.docs.length;
      if(length > 0){
        
        const client_detail = await FindSpecificClientFromClient({_id : req.body.parent_client_id});
        console.log("client detail",client_detail);
        
          for (let client of allClient.docs) {
          delete client.contact;
          delete client.email;
          delete client.password;
          delete client.status;
          delete client.environment;
          delete client.created_by;
          delete client.updated_by;
          delete client.updated_at;
          delete client.__v;
          client.upper_level = client_detail.client_name;
          client.slno = allClient.docs.indexOf(client) + 1;
          client.balance = 0;
          client.currency = "KRW";
          //console.log("client", client);
        }
        res.status(200).send({
          result : allClient,
          message : "all client found"
        })

      
      

    }
    else{
      res.status(200).send({
        result : allClient,
        message : "all client found"
      })
  
    }

  }
  
}
catch(e){
  console.log("error from all_client",e);
}
}

//edit client
let edit_client = async(req,res,next) => {
  try {
    req.body.client_name = req.body.firstname + " " + req.body.lastname;
    const update_account = await ClientTable.updateOne(
      { _id: req.body._id }, // Specify the filter to match the document
      { $set: { client_name: req.body.client_name, email: req.body.email, contact: req.body.contact, username: req.body.username, currency: req.body.currency } } // Specify the update operation
    );

    console.log("updated_account", update_account);
    if (update_account) {
      res.status(200).send({
        updated_account: update_account,
        message: "account details updated",
      });
    } else {
      res.status(400).send({
        updated_account: update_account,
        message: "account details could not updated",
      });
    }
  } catch (e) {
    console.log("error from update_account", e);
  }
}

// let all_client = async (req,res,next) =>{
//   try{
//     const agg = await AdminTable.aggregate([
//       {
//         $lookup: {
//           from: "clients",
//           localField: "_id",
//           foreignField: "parent_client_id",
//           as: "all",
//         },
//       },
//       {
//         $unwind: "$all", // Unwind the array created by $lookup
//       },
//       {
//         $project: {
//           username: "$username",
//           role : "$role",
//           client_id: "$all._id",
//           client_name: "$all.username",
//         },
//       },
//     ]);
//       let upper_level;
//       let role;
//       for(find_logged_in_member of agg){
//         console.log("req.user.id",req.user.id);
//         console.log("req.body.parent_client_id",req.body.parent_client_id);
//       if(find_logged_in_member._id==(req.user.id^req.body.parent_client_id)){
//         console.log("agg",agg);
//         console.log("find_logged_in_member._id",find_logged_in_member._id);
//         upper_level = find_logged_in_member.role ;
//         role = find_logged_in_member.role ;
//         //console.log("upper_levell",upper_level);

//       }
//       else if(find_logged_in_member.client_id == (req.user.id ^ req.body.parent_client_id)){
//         upper_level = find_logged_in_member.client_name ;
//         role = "client";
//         //console.log("upper_level",upper_level);
//       }

//     }
//       console.log("upper_level",upper_level);
//       if(req.body.role == "superadmin" ){
//         console.log("agg",agg);
//         console.log("find_logged_in_member._id",find_logged_in_member._id);
//         //upper_level = find_logged_in_member.role ;
//         const query_to_find_all_client = {parent_client_id : req.user.id }
//         let all_client = await FindAllClient(query_to_find_all_client);
//         if(all_client.docs.length>0){
//           all_client = JSON.parse(JSON.stringify(all_client));
  
//          }
        
//         const query_to_find_specific_client = { _id : req.user.id} ;
//         const find_parent = await FindSpecificAdminFromAdmin(query_to_find_specific_client);
//         for (let client of all_client.docs) {
//           delete client.contact;
//           delete client.email;
//           delete client.password;
//           delete client.status;
//           delete client.environment;
//           delete client.created_by;
//           delete client.updated_by;
//           delete client.updated_at;
//           delete client.__v;
//           client.upper_level = upper_level;
//           client.slno = all_client.docs.indexOf(client) + 1;
//           client.balance = 0;
//           client.currency = "KRW";
//           //console.log("client", client);
//         }
  
//         res.status(200).send({
//           result : all_client
//         })
  

//       }
//       else if(role == "client" ){
//         upper_level = find_logged_in_member.client_name ;
        
//         console.log("upper_level",upper_level);
//         const query_to_find_all_client = {parent_client_id : req.body.parent_client_id }||{parent_client_id : req.user.id}
      
//         let all_client = await FindAllClient(query_to_find_all_client);
//         all_client = JSON.parse(JSON.stringify(all_client));
//         if(all_client.docs.length>0){
//           all_client = JSON.parse(JSON.stringify(all_client));
  
//          }
//         const query_to_find_specific_client = { _id : req.body.parent_client_id} ;
//         const find_parent = await FindSpecificClient(query_to_find_specific_client);
//         for (let client of all_client.docs) {
//           delete client.contact;
//           delete client.email;
//           delete client.password;
//           delete client.status;
//           delete client.environment;
//           delete client.created_by;
//           delete client.updated_by;
//           delete client.updated_at;
//           delete client.__v;
//           client.upper_level = upper_level;
//           client.slno = all_client.docs.indexOf(client) + 1;
//           client.balance = 0;
//           client.currency = "KRW";
//           //console.log("client", client);
//         }
  
//         res.status(200).send({
//           result : all_client
//         })
  
//       }

    

    
//   }
//   catch(e){
//     console.log("error from all_client api",e);
//   }
// }

// let all_client = async (req, res, next) => {
//   try {
    
//     // console.log("req.user.id", req.user);
//     // const agg = await AdminTable.aggregate([
//     //   {
//     //     $lookup: {
//     //       from: "clients",
//     //       localField: "_id",
//     //       foreignField: "parent_client_id",
//     //       as: "all",
//     //     },
//     //   },
//     //   {
//     //     $unwind: "$all", // Unwind the array created by $lookup
//     //   },
//     //   {
//     //     $project: {
//     //       username: "$username",
//     //       role : "$role",
//     //       client_id: "$all._id",
//     //       client_name: "$all.username",
//     //     },
//     //   },
//     // ]);
//     // const query_to_find_logged_in_client = { _id: req.user.id };
//     // const find_one = await FindSpecificClient(query_to_find_logged_in_client);
//     // console.log("find_one",find_one);
//     let upper_level;

//     for(find_logged_in_member of agg){
//       if(find_logged_in_member._id==req.user.id){
//         console.log("agg",agg);
//         console.log("find_logged_in_member._id",find_logged_in_member._id);
//         upper_level = find_logged_in_member.role ;

//       }
//       else if(find_logged_in_member.client_id == req.user.id || find_logged_in_member.client_id == req.body.client_id){
//         upper_level = find_logged_in_member.client_name ;
//         console.log("upper_level",upper_level);
//       }

//     }

//     if(upper_level == "admin" || upper_level == "superadmin"){
//       const query_for_all_client_by_admin_or_super_admin = { parent_client_id: req.user.id };
//       const all_client = await FindAllClient(query_for_all_client_by_admin_or_super_admin);
//     let each_client = JSON.parse(JSON.stringify(all_client));

  

//     //let upper_level;
//     // for (let member of agg) {
//     //   if (member._id == req.user.id) {
//     //     upper_level = "superadmin";
//     //   } else if (member.client_id == req.user.id) {
//     //     upper_level = member.client_name;
//     //   }
//     // }

//     for (let client of each_client.docs) {
//       delete client.contact;
//       delete client.email;
//       delete client.password;
//       delete client.status;
//       delete client.environment;
//       delete client.created_by;
//       delete client.updated_by;
//       delete client.updated_at;
//       delete client.__v;
//       client.upper_level = upper_level;
//       client.slno = all_client.docs.indexOf(client) + 1;
//       client.balance = 0;
//       client.currency = "KRW";
//       console.log("client", client);
//     }
//     res.status(200).send({
//       result: each_client,
//       message: "all_client list"
//     });

//     }
//     else {
//     // const query = { parent_client_id: req.query.parent_client_id };
//     // const nested_clients = await FindAllClient(query);
//     // console.log("nested_clients", nested_clients);
//     // res.status(200).send({
//     //   result: nested_clients,
//     // });
//     console.log("req.query.id",req.query.id);
//     const query_for_logged_in_client = { client_id : req.body.client_id };
//     const query_for_nested_client = { parent_client_id: req.body.parent_client_id };
//     const all_client = await FindAllClient(query_for_nested_client);
//     //if()
//     //const find_logged_in_client = await FindSpecificClient(query_for_logged_in_client);
//     //console.log("find_logged_in_client",find_logged_in_client)
//     let each_client = JSON.parse(JSON.stringify(all_client));
//     console.log("each_client",each_client);
//     if(each_client.docs.length>0){
//       for (let client of each_client.docs) {
//         delete client.contact;
//         delete client.email;
//         delete client.password;
//         delete client.status;
//         delete client.environment;
//         delete client.created_by;
//         delete client.updated_by;
//         delete client.updated_at;
//         delete client.__v;
//         client.upper_level = upper_level;
//         client.slno = all_client.docs.indexOf(client) + 1;
//         client.balance = 0;
//         client.currency = "KRW";
//         console.log("client", client);
//       }
//       res.status(200).send({
//         result: each_client,
//         message: "all_client list",
//       });
  

//     }
//     else{
//       res.status(400).send({
        
//         message: "there is no sub client for this parent",
//       });

//     }


//     }
    
//   } catch (e) {
//     console.log("error from all client", e);
//   }
// };

//api for client
let nested_client = async (req, res, next) => {
  try {
    const query = { parent_client_id: req.query.parent_client_id };
    const nested_clients = await FindAllClient(query);
    console.log("nested_clients", nested_clients);
    res.status(200).send({
      result: nested_clients,
    });
  } catch (e) {
    console.log("error from show nested client", e);
    res.status(400).send({
      error: e,
    });
  }
};

//log_in API for client

let log_in = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log("username", username);
    console.log("password", password);
    const query = {
      username: username,
    };
    const client = await FindSpecificClient(query);
    console.log("client", client);
    if (client) {
      if (client.username == username && client.password == password) {
        token = jwt.sign(
          { id: client.id, email: client.username },
          process.env.ENC_KEY,
          { expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME }
        );
        res.status(200).send({
          message: "you are logged in",
          token: token,
        });
      } else {
        res.status(400).send({
          message: "error in log in",
        });
      }
    } else {
      res.status(400).send({
        message: "there is no such client in client table",
      });
    }
  } catch (e) {
    console.log("error", e);
  }
};



/**
 * 
 * @author Injamamul Hoque
 * @function setRouter
 * @param {*} req res
 * @returns res
 * @created_at 19.10.2023
 * 
 */

const search_client_user = async (req,res) => {

  try {

    let result = {};
    let query ;
    let search_str = req.body.search;
    let type = req.body.type;

    switch (type) {

      case "client":

          if (mongoose.Types.ObjectId.isValid(search_str)) {
            query = { _id: search_str };
          } else {
            query = { username: search_str };
          }

          let client_details = await ClientTable.findOne(query);

          if(!checkLib.isEmpty(client_details)){
            result = {
              details :{
              client_name : client_details.client_name,
              user_name : client_details.username,
              client_code : client_details._id,
              balance : "0.00",
              registered_date: "2023"
            },
            hierarchy : await commonControllers.find_level(client_details)
            }
          }else{
            throw new Error("Invalid client_user_name or client_code")
          }
        break;

      case "user":

        if (mongoose.Types.ObjectId.isValid(search_str)) {
          query = { _id: search_str };
        } else {
          throw new Error("Invalid user_code");
        }
        let player_details = await PlayerTable.findOne(query)
        let client;
        if(!checkLib.isEmpty(player_details)){
          await PlayerTable.findOne({ _id: search_str })
          .populate({
            path: 'account_id',
            model: 'Accounts',
            populate: {
            path: 'client_id',
            model: 'Client'
          }
        })
        .then(player => {
        if (player) {
           client = player.account_id.client_id;
        } else {
          throw new Error("player not found")
        }
      })
      .catch(err => {
        throw new Error(err.message);
      });

      let hierarchy = await commonControllers.find_level(client);

      hierarchy.push({ 
        client_user_name: client.username,
        client_name: client.client_name
        })
      
        result = {
          details :{
          user_name : player_details.username,
          user_code : player_details._id,
          balance : "0.00",
          registered_date: "2023"
        },
        hierarchy : hierarchy
        }
      
      }
        break;
      default:
        throw new Error("something went wrong");
    }
    let apiResponse = responseLib.generate(false,"data fetch successfully",result);
    res.status(200).send(apiResponse);
    
  } catch (error) {
    let apiResponse = responseLib.generate(true,error.message,null);
    res.status(403).send(apiResponse);
  }

};



module.exports = {
  add_client: add_client,
  all_client: all_client,
  log_in: log_in,
  add_client_by_client: add_client_by_client,
  nested_client: nested_client,
  edit_client : edit_client,
  search_client_user : search_client_user
};
