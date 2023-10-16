const timeLIb = require("../libs/timeLib");
const jwt = require("jsonwebtoken");
const apiError = require("../libs/apiError");
const responseMessage = require("../libs/responseMessage");
// const client = require("../services/client");
// const { AddClient, FindAllClient, FindSpecificClient } = client;
const db = require("../../config/config.json");
console.log("db", db.development.database);
var data = db.development.database;
const mongoose = require("mongoose");
const ClientTable = mongoose.model("Client");
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
const FindSpecificClientFromAdmin = async (query) => {
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
// let all_client = async (req, res, next) => {
//   try {

//       //const query = {};
//       console.log("req.query",req.query);
//       //console.log("validatedBody.value",validatedBody.value);
//       const all_client = await FindAllClient(req.query)
//         .then((result) => {
//           console.log("all client",result.docs);
//           const obj = JSON.parse(JSON.stringify(result));
//           console.log("obj",obj);

//           for(let i of obj.docs){
//             var find_parent = {};
//             if(i.parent_client_id){

//               query = {_id : i.parent_client_id}
//               console.log("query",query);
//               (async () => {

//                  await FindSpecificClientFromAdmin(query)

//                   .then((client)=>{
//                     console.log("clienttt",client);
//                     console.log("insidethen",i);
//                   //find_parent = client;
//                   //const upper = JSON.parse(JSON.stringify(client));
//                   i.upper_level= client.admin_name;
//                   console.log("i.upper_level",i.upper_level);
//                   console.log("ix",i);
//                   //let  find_parent = Object.assign(find_parent, i);

//                      return result
//                   //console.log("find_parent vvv ",find_parent);

//                   })

//                   .catch((e)=>{console.log("error",e)});

//                   //return i;

//                    //console.log("find_parent",find_parent);
//                  //return find_parent;
//                 //console.log("ix",i);
//               })();

//              // console.log("find_parent",find_parent);
//               //i.upper_level= "client";
//             }
//             //console.log("find_parent",result);

//             console.log("ixoutside async",i);
//             i.balance = 0;
//             i.currency = "KRW";
//             i.slno = obj.docs.indexOf(i)+1;
//             delete i.contact;
//             delete i.email;
//             delete i.password;
//             delete i.status;
//             delete i.environment;
//             delete i.created_by;
//             delete i.updated_by;
//             delete i.updated_at;
//             delete i.__v;

//             console.log("iiiii",i);
//           }
//           res.status(200).send({
//             result: obj,
//             mesage: "all_client list",
//           });
//         })
//         .catch((err) => {
//           res.status(404).send({
//             err: err.message,
//           });
//         });

//   } catch (e) {
//     next(e);
//   }
// };
// let all_client = async (req, res, next) => {
//   try {
//     console.log("req.query", req.query);
//     const result = await FindAllClient(req.query);
//     console.log("result", result);
//     const allClients = [];

//     for (let client of result.docs) {
//       try {
//         client = JSON.parse(JSON.stringify(client));

//         const query = { _id: client.parent_client_id };
//         const parentClient = await FindSpecificClientFromClient(query);

//         if (parentClient) {
//           client.upper_level = parentClient.client_name;
//         } else {
//           client.upper_level = "superadmin";
//         }

//         // Set these properties to maintain in the response
//         client.balance = 0;
//         client.currency = "KRW";
//         client.slno = result.docs.indexOf(client) + 1;

//         // Remove these properties from the client object
//         delete client.contact;
//         delete client.email;
//         delete client.password;
//         delete client.status;
//         delete client.environment;
//         delete client.created_by;
//         delete client.updated_by;
//         delete client.updated_at;
//         delete client.__v;
//         delete client.parentClient;

//         console.log("cliennnn", client);
//         allClients.push(client);
//       } catch (error) {
//         console.error("Error processing client:", error);
//         // Handle errors for individual clients here
//       }
//     }
//     console.log("all clients", allClients);
//     res.status(200).send({
//       result: {
//         docs: allClients,
//         total: result.total,
//         limit: result.limit,
//         page: result.page,
//         pages: result.pages,
//       },
//       message: "all_client list",
//     });
//   } catch (error) {
//     console.error("Error in all_client API:", error);
//     res.status(500).send({
//       error: error.message,
//     });
//   }
// };

let all_client = async (req, res, next) => {
  try {
    
    console.log("req.user.id", req.user);
    const agg = await AdminTable.aggregate([
      {
        $lookup: {
          from: "clients",
          localField: "_id",
          foreignField: "parent_client_id",
          as: "all",
        },
      },
      {
        $unwind: "$all", // Unwind the array created by $lookup
      },
      {
        $project: {
          username: "$username",
          role : "$role",
          client_id: "$all._id",
          client_name: "$all.username",
        },
      },
    ]);
    // const query_to_find_logged_in_client = { _id: req.user.id };
    // const find_one = await FindSpecificClient(query_to_find_logged_in_client);
    // console.log("find_one",find_one);
    let upper_level;

    for(find_logged_in_member of agg){
      if(find_logged_in_member._id==req.user.id){
        console.log("agg",agg);
        console.log("find_logged_in_member._id",find_logged_in_member._id);
        upper_level = find_logged_in_member.role ;

      }
      else if(find_logged_in_member.client_id == req.user.id){
        upper_level = find_logged_in_member.client_name ;
        console.log("upper_level",upper_level);
      }

    }

    if(upper_level == "admin" || upper_level == "superadmin"){
      const query_for_all_client_by_admin_or_super_admin = { parent_client_id: req.user.id };
      const all_client = await FindAllClient(query_for_all_client_by_admin_or_super_admin);
    let each_client = JSON.parse(JSON.stringify(all_client));

  

    //let upper_level;
    // for (let member of agg) {
    //   if (member._id == req.user.id) {
    //     upper_level = "superadmin";
    //   } else if (member.client_id == req.user.id) {
    //     upper_level = member.client_name;
    //   }
    // }

    for (let client of each_client.docs) {
      delete client.contact;
      delete client.email;
      delete client.password;
      delete client.status;
      delete client.environment;
      delete client.created_by;
      delete client.updated_by;
      delete client.updated_at;
      delete client.__v;
      client.upper_level = upper_level;
      client.slno = all_client.docs.indexOf(client) + 1;
      client.balance = 0;
      client.currency = "KRW";
      console.log("client", client);
    }
    res.status(200).send({
      result: each_client,
      agg : agg,
      message: "all_client list"
    });

    }
    else {
    // const query = { parent_client_id: req.query.parent_client_id };
    // const nested_clients = await FindAllClient(query);
    // console.log("nested_clients", nested_clients);
    // res.status(200).send({
    //   result: nested_clients,
    // });
    const query_for_logged_in_client = { client_id : req.user.id };
    const query_for_nested_client = { parent_client_id: req.user.id };
    const all_client = await FindAllClient(query_for_nested_client);
    const find_logged_in_client = await FindSpecificClient(query_for_logged_in_client);
    console.log("find_logged_in_client",find_logged_in_client);
    let each_client = JSON.parse(JSON.stringify(all_client));
    for (let client of each_client.docs) {
      delete client.contact;
      delete client.email;
      delete client.password;
      delete client.status;
      delete client.environment;
      delete client.created_by;
      delete client.updated_by;
      delete client.updated_at;
      delete client.__v;
      client.upper_level = upper_level;
      client.slno = all_client.docs.indexOf(client) + 1;
      client.balance = 0;
      client.currency = "KRW";
      console.log("client", client);
    }
    res.status(200).send({
      result: each_client,
      agg : agg,
      message: "all_client list",
    });


    }
    
  } catch (e) {
    console.log("error from all client", e);
  }
};

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

module.exports = {
  add_client: add_client,
  all_client: all_client,
  log_in: log_in,
  add_client_by_client: add_client_by_client,
  nested_client: nested_client,
};
