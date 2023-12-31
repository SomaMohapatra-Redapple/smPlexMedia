const timeLIb = require("../libs/timeLib");
const responseLib = require("../libs/responseLib");
// const account = require("../services/account");
// const { AddAccount, ShowAccount } = account;
const mongoose = require("mongoose");
const AccountTable = mongoose.model("Accounts");
const AccountsTechnicalsTable = mongoose.model("AccountsTechnicals");
//const { ObjectId } = require('mongodb');
const ObjectId = mongoose.Types.ObjectId;

const AddAccount = async (query) => {
  return await AccountTable.create(query);
};
const AccountUpdate = async (query) => {
  return AccountTable.updateOne(query);
};
const AddAccountTechnicals = async (query) => {
  return await AccountsTechnicalsTable.create(query);
};

const ShowAccountTechnicals = async (query) => {
  return await AccountsTechnicalsTable.findOne(query);
};
const AccountTechnicalsUpdate = async (query) => {
  return AccountsTechnicalsTable.updateOne(query);
};

//add account
const add_account = async (req, res, next) => {
  try {
    const query = req.body;
    query.created_at = timeLIb.now();
    query.updated_at = timeLIb.now();
    query.service_endpoint = " ";
    query.api_secret = " ";
    query.api_username = " ";
    const added_account = await AddAccount(query);

    query.account_id = added_account._id ;

    const added_account_technicals = await AddAccountTechnicals(query);
    console.log("added_account",added_account);
    console.log("added_account_technicals",added_account_technicals);
    if(Object.keys(added_account).length >0 & Object.keys(added_account_technicals).length>0)
    {
      res.status(200).send({
        added_account: added_account,
        added_account_technicals: added_account_technicals,
        message: "account created",
      });
 
    }else{
      res.status(400).send({
        message : "account could not got added"
      });

    }
    
  } catch (e) {
    return res.status(400).send({
      message : e
    });
  }
};

//update_account
const update_account = async (req, res, next) => {
  try {


    const update_account = await AccountTable.updateOne(
      { _id: req.body._id }, // Specify the filter to match the document
      { $set: { account_name: req.body.account_name, account_type: req.body.account_type, environment: req.body.environment, currency: req.body.currency, status: req.body.status } } // Specify the update operation
    );

    const update_account_technical = await AccountsTechnicalsTable.updateOne(
      { account_id: req.body._id }, // Specify the filter to match the document
      { $set: { account_name: req.body.account_name, account_type: req.body.account_type, environment: req.body.environment, currency: req.body.currency, status: req.body.status } } // Specify the update operation
    );
    
    //const updated_account = await AccountTechnicalsUpdate(req.body);
    console.log("updated_account", update_account);
    if (update_account || update_account_technical) {
      res.status(200).send({
        message: "account details updated",
      });
    } else {
      res.status(400).send({
        
        message: "account details could not updated",
      });
    }
  } catch (e) {
    console.log("error from update_account", e);
  }
};


//add account_techicals
const add_account_techicals = async (req, res, next) => {
  try {
    const query = req.body;
    query.created_at = timeLIb.now();
    query.updated_at = timeLIb.now();
    const added_account = await AddAccountTechnicals(query)
      .then((result) => {
        res.status(200).send({
          result: result,
          message: "account created",
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

//show account
const show_account = async (req, res, next) => {
  try {
    const query = {account_id : req.body.account_id}; //validatedBody.value;
    const page = parseInt(req.query.page)||2; // Replace with your desired page number
    const perPage = parseInt(req.query.limit)||10; // Replace with the number of results per page
    

  let show_all_account = await AccountTable.aggregate([
    {
      $match: {
        "client_id": new ObjectId(req.body.client_id), // Create a new instance of ObjectId
      },
    },
    {
      $lookup: {
        from: "accountstechnicals",
        localField: "_id",
        foreignField: "account_id",
        as: "all",
      },
    },
    {
      $unwind: "$all", // Unwind the array created by $lookup
    },
    {
      $project: {
        username: "$username",
        status: "$status",
        environment: "$all.environment",
        account_type: "$all.account_type",
        currency: "$all.currency",
        client_id : "$all.client_id"
      },
    },
    {
      $skip: (page - 1) * perPage,
    },
    {
      $limit: perPage,
    }
  ]);

  const countAggregation = [
    {
      $match: {
        "client_id": new ObjectId(req.body.client_id), // Create a new instance of ObjectId
      },
    },
    {
      $lookup: {
        from: "accountstechnicals",
        localField: "_id",
        foreignField: "account_id",
        as: "all",
      },
    },
    {
      $unwind: "$all", // Unwind the array created by $lookup
    },
    {
      $project: {
        username: "$username",
        status: "$status",
        environment: "$all.environment",
        account_type: "$all.account_type",
        currency: "$all.currency",
        client_id : "$all.client_id"
      },
    }
  ]; 
  let countResult = await AccountTable.aggregate(countAggregation);

const total = countResult.length > 0 ? countResult.length : 0;

    
  console.log("show_all_account",show_all_account); 
    if(show_all_account.length>0){
      show_all_account = JSON.parse(JSON.stringify(show_all_account));
      for(let each of show_all_account){
        each.slno = show_all_account.indexOf(each)+1;
      }

      console.log("show_all_account",show_all_account);
      let apiResponse = responseLib.generate(
        false,
        "data fetch successfully",
        { show_all_account, total,limit: perPage,
          page: page }
      );
      res.status(200).send(apiResponse);

    }
    else{
      res.status(400).send({
        message: "no accounts found",
      });

    }

  } catch (e) {
    console.log("error", e);
    return next(e);
  }
};

//show account_technicals
const show_account_technicals = async (req,res,next) => {
  try{
    const query = {account_id : req.body.account_id};
    let data = {};
    console.log("req.body.account_id",req.body);
    if (!mongoose.Types.ObjectId.isValid(req.body.account_id)) {
      let apiResponse =  responseLib.generate(true,"invalid ObjectId provided");
      res.status(400).send(apiResponse)


    }
    else{
      const account_technicals = await ShowAccountTechnicals(query);
      if(account_technicals)
      {
        console.log("account_technicals",account_technicals);
        data.account_id = account_technicals.account_id;
        data.api_secret = account_technicals.api_secret;
        data.service_endpoint = account_technicals.service_endpoint;
      
      let apiResponse =  responseLib.generate(false,"account_technicals found for the account_id",data);
      res.status(200).send(apiResponse)
    
      }
      else{
        let apiResponse =  responseLib.generate(true,"no account_technicals exists for this account_id");
      res.status(404).send(apiResponse)
  
      }

    }



  }
  catch(e){
    console.log("error from account technicals",e);

  }

};

module.exports = {
  add_account: add_account,
  show_account: show_account,
  add_account_techicals: add_account_techicals,
  update_account: update_account,
  show_account_technicals : show_account_technicals
};
