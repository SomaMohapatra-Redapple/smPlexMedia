/**
 *
 * @author Injamamul Hoque
 * @purpose microgaming provider integration common functions
 * @createdDate sep 26 2023
 * @lastUpdated sep 26 2023
 *
 */

// module import
let axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const checkLib = require("../libs/checkLib");
const playerModel = mongoose.model("Player");
const gameModel = mongoose.model("Game");
const AccountsModel = mongoose.model("Accounts");
const catagoryModel = mongoose.model("Category");
const ClientproviderAccountMappingModel = mongoose.model(
  "Client_provider_account_mapping"
);
const AccountsTechnicalsModel = mongoose.model("AccountsTechnicals");
const transactionModel = mongoose.model("Transaction");
const ClientProviderModel = mongoose.model("Client_provider_mapping");
const ProviderModel = mongoose.model("Provider");
//const apiLib = require('../libs/apiLib')
const appConfig = require("../../config/appConfig");
//const { Currency } = require('../../../../SMDB/dbObject');
const serverLib = require("../libs/serverLib");
let provider_id = appConfig.provider_id;
const redis = require("../libs/redisLib");
//console.log("provider_id: " + provider_id);

/**
 *
 * @author Injamamul Hoque
 * @function checkUsercodeExists
 * @param {*} usercode
 * @returns userdtls/null
 *
 */
const checkUsercodeExists = async (usercode) => {
  try {
    let user = await playerModel.findById(usercode).lean();
    return user;
  } catch (error) {
    return null;
  }
};

const checkUserExistOrRegister = async (account_user_id, account_id) => {
  try {
    //console.log("all the detaisl "+account_id+" account_user_id "+account_user_id+" currency "+currency+" language "+language)
    let plyr_details = await playerModel.findOne({
      account_id: account_id,
      account_user_id: account_user_id,
    });
    console.log("player details....", plyr_details);
    if (checkLib.isEmpty(plyr_details)) {
      let newPlayer = new playerModel({
        account_id: account_id,
        account_user_id: account_user_id,
        currency_code: currency,
        language_code: language,
        status: "online",
      });
      let data = await newPlayer.save();
      return {
        error: false,
        data: data,
      };
    } else {
      return {
        error: false,
        data: plyr_details,
      };
    }
  } catch (error) {
    console.log(error.message);
    return {
      error: true,
      desc: error,
    };
  }
};

let getGameDetails = async () => {
  try {
    let result = await gameModel.findOne({ game_provider_id: provider_id });
    return result;
  } catch (err) {
    console.log("Get game details catch error : ", err.message);
    return false;
  }
};
let gameCatagoryDetails = async (game_catagory_id) => {
  try {
    let result = await catagoryModel.findOne({ _id: game_catagory_id });
    return result;
  } catch (err) {
    return false;
  }
};
let isBetEnable = async (account_id) => {
  try {
    let maintenance_mode_status = "Y";
    let rejectionStatus = true;

    let acountDetails = await AccountsTechnicalsModel.findOne({
      account_id: account_id,
    }).lean();
    //console.log("Account details from..... ",acountDetails)

    if (checkLib.isEmpty(acountDetails) == false) {
      maintenance_mode_status = acountDetails.is_maintenance_mode_on;
      let accountProviderTag = await ClientProviderModel.findOne({
        account_id: account_id,
      });

      // console.log("Account provider tag: " + accountProviderTag)
      if (checkLib.isEmpty(accountProviderTag) == false) {
        rejectionStatus = false;
      } else {
        rejectionStatus = true;
      }

      return {
        rejectionStatus: rejectionStatus,
        maintenance_mode_status: maintenance_mode_status,
      };
    } else {
      return {
        rejectionStatus: true,
        maintenance_mode_status: "Y",
      };
    }
  } catch (e) {
    console.log("error ==>", e);
  }
};

const setProviderInRedis = async () => {
  let provider_id = appConfig.provider_id;
  let providerdtls = await ProviderModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(provider_id),
      },
    },
    {
      $lookup: {
        from: "provider_accounts",
        localField: "_id",
        foreignField: "provider_id",
        as: "accounts",
      },
    },
  ]);
  if (providerdtls.length < 1 || providerdtls[0].accounts.length < 1)
    return false;
  else {
    providerdtls = providerdtls[0];

    let dataToSave = {
      id: providerdtls._id,
      name: providerdtls.game_provider_name,
      is_subprovider: providerdtls.is_subprovider,
    };

    providerdtls.accounts.forEach((element) => {
      if (element.is_default) {
        dataToSave[`account-default`] = {
          name: element.provider_account_name,
          technical_details: element.technical_details,
          is_default: element.is_default,
          currency: element.currency,
          game_category: element.game_category,
        };
      } else {
        dataToSave[`account-${element._id}`] = {
          name: element.provider_account_name,
          technical_details: element.technical_details,
          is_default: element.is_default,
          currency: element.currency,
          game_category: element.game_category,
        };
      }
    });

    let added = await redis.add(`provider-${provider_id}`, dataToSave);
    if (added) return true;
    else return false;
  }
};

let trans_dtls = async (
  req,
  trns_type,
  function_name,
  user_code,
  operator_transaction_id
) => {
  try {
    const userdtls = await checkUsercodeExists(user_code);
    //console.log("user details in transaction section...",userdtls);
    const game_details = await getGameDetails();
    console.log("game details in transaction section..", game_details);
    let category_id = game_details.game_category_id;
    console.log("categoryid", category_id);
    const categoryDetails = await gameCatagoryDetails(category_id);
    //console.log("categoryDetails in transaction section",categoryDetails)
    //console.log("game category name",categoryDetails.category)

    const trans = new transactionModel({
      session_id: "null",
      account_id: req.account_id,
      account_user_id: userdtls.account_user_id,
      user_id: userdtls.user_id,
      game_id: game_details._id,
      game_name: game_details.game_name[0].En,
      provider_id: provider_id,
      provider_name: "Microgaming",
      provider_transaction_id: req.refund_tx_id,
      game_category_id: category_id,
      game_category_name: categoryDetails.category,
      round_id: req.round_id,
      operator_transaction_id: operator_transaction_id,
      transaction_amount: Math.abs(req.amount),
      transaction_type: trns_type,
      action: function_name,
      available_balance : 1999, // get it from client response
      status: "0",
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    // let debitDataInsert = new transactionModel(trans);
    // const debitInsertReturn = await debitDataInsert.save();
    // return debitInsertReturn;
    //console.log(trans)
    let result = await trans.save();
    return result;
  } catch (err) {
    return err;
  }
};

let logTransaction = async (
  function_name,
  req,
  user_code,
  operator_transaction_id
) => {
  try {
    let value = {};
    switch (function_name) {
      case "BET":
        console.log("Hello......");
        value = await trans_dtls(
          req,
          "DEBIT",
          function_name,
          user_code,
          operator_transaction_id
        );
        console.log("value.....", value);
        break;
      case "WIN":
        value = await trans_dtls(
          req,
          "CREDIT",
          function_name,
          user_code,
          operator_transaction_id
        );
        break;
      case "REFUND":
        value = await trans_dtls(
          req,
          "CREDIT",
          function_name,
          user_code,
          operator_transaction_id
        );
        break;
      default:
        value.error = true;
        break;
    }
    return value;
  } catch (err) {
    return err;
  }
};

const postDataFromAPI = async (apiUrl, endpoint, bodyData) => {
  try {
    console.log("...body data...", bodyData);
    let url = `${apiUrl}/callback?function=${endpoint}`;
    let requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: bodyData,
    };
    console.log("request log is ", requestOptions);
    const data = await serverLib.server.getData(url, requestOptions);
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    let data = {
      err: true,
    };
    return data;
  }
};

const getProviderAccountTechnicals = async (provider_account_id) => {
  try {
    // console.log("i'm in get provider account technicals  ",provider_account_id)
    let provider_id = appConfig.provider_id;
    let providerId = `provider-${provider_id}`;
    let accountsData = await redis.get(providerId);
    // let accountsData = JSON.parse(providerAccountsData);
    // if the provider_account null we send the default provider account
    if (accountsData.error) {
      return {
        error: true,
      };
    }
    accountsData = accountsData.data;

    if (provider_account_id == null) {
      let payLoad = {
        error: false,
        data: accountsData[`account-default`],
      };
      return payLoad;
    }

    // if the provider_account_id has any value
    if (accountsData.hasOwnProperty(`account-${provider_account_id}`)) {
      let payLoad = {
        error: false,
        data: accountsData[`account-${provider_account_id}`],
      };
      return payLoad;
    } else {
      let payLoad = {
        error: false,
        data: accountsData[`account-default`],
      };
      return payLoad;
    }
  } catch (error) {
    let payLoad = {
      error: true,
      message: error.message,
    };
    return payLoad;
  }
};

const getGameDetailsByGameId = async (game_id) => {
  try {
    let gamedtls = await gameModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(game_id),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "game_category_id",
          foreignField: "_id",
          as: "categorydtls",
        },
      },
      {
        $unwind: "$categorydtls",
      },
    ]);
    if (gamedtls.length > 0) return gamedtls[0];
    else return {};
  } catch (e) {
    console.log("error ==>", e);
    return {};
  }
};

const checkProviderAccountLink = async (account_id, provider_id) => {
  try {
    //console.log("i'm in checkProviderAccountLink section..."+account_id+"provider id"+provider_id)
    let providerAccount = await ClientproviderAccountMappingModel.findOne({
      account_id: account_id,
      provider_id: provider_id,
    }).lean();
    // console.log("provider account....",providerAccount)
    if (checkLib.isEmpty(providerAccount)) {
      return {
        error: false,
        data: null,
      };
    } else {
      return {
        error: false,
        data: providerAccount.provider_account_id,
      };
    }
  } catch (error) {
    console.log(error.message);
    return {
      error: true,
      message: error.message,
    };
  }
};

const isAccountExists = async (account_id) => {
  let accountdtls = await AccountsModel.findById(account_id).lean();
  if (checkLib.isEmpty(accountdtls)) return false;
  else return true;
};

let setAuthToken = async (provider_params, language, currency) => {
  try {
    //console.log("...provider params ", provider_params);

    // let post_field = `grant_type=password&username=${provider_params.username}&password=${provider_params.password}`;

    let data = {
        'grant_type': 'password',
        'username': provider_params.username,
        'password': provider_params.password 
      };

    let base64 = Buffer.from(
      provider_params.user_auth + ":" + provider_params.user_auth_pass
    ).toString("base64");

    let auth_token = "Basic " + base64;
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": auth_token,
      "X-DAS-TX-ID": uuidv4(),
      "X-DAS-TZ": "UTC+9",
      "X-DAS-LANG": "en_US", //language,
      "X-DAS-CURRENCY": "USD", //currency
    };

    //console.log(" headers....",headers);
    // const response = await axios.post(provider_params.token_url, post_field, {
    //   headers: headers,
    // });

    let config = {
        method :"post",
        headers : headers,
        data :data,
        url : provider_params.token_url
    }

    let response = await axios(config);

   // console.log("set auth token response: " + response)

    if (response.data && response.data.access_token) {
      let token = response.data.access_token;
     // let expires_in = response.data.expires_in;

      return token;
    }

    return false;
  } catch (error) {
    console.log("error message...", error.message);
    return false;
  }
};

module.exports = {
  getProviderAccountTechnicals: getProviderAccountTechnicals,
  getGameDetailsByGameId: getGameDetailsByGameId,
  checkProviderAccountLink: checkProviderAccountLink,
  isAccountExists: isAccountExists,
  checkUsercodeExists: checkUsercodeExists,
  getGameDetails: getGameDetails,
  gameCatagoryDetails: gameCatagoryDetails,
  isBetEnable: isBetEnable,
  logTransaction: logTransaction,
  setProviderInRedis: setProviderInRedis,
  postDataFromAPI: postDataFromAPI,
  checkUserExistOrRegister: checkUserExistOrRegister,
  setAuthToken: setAuthToken,
};
