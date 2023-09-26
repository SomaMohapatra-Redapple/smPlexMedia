const responseLib = require("../libs/responseLib");
const appConfig = require("../../config/appConfig");
let check = require("../libs/checkLib");

let rateLimiter = (secondsWindow = 60, allowedHits = 5) => {
  try {
    return async (req, res, next) => {
      let client = require("../../../api-server/www/db/db").redis_client;
      //await client.connect();
      let counter_id = req.user.user_id;
      let requests = await client.incr(counter_id);
      let ttl;
      if (requests == 1) {
        await client.expire(counter_id, secondsWindow);
        ttl = secondsWindow;
      } else {
        ttl = await client.ttl(counter_id);
      }
      //await client.disconnect();
      if (requests > allowedHits) {
        let apiResponse = responseLib.generate(
          true,
          `Too many Requests..Try after cool-down`,
          { callsInAMinute: requests, ttl: ttl }
        );
        res.status(429).send(apiResponse);
      } else {
        next();
      }
    };
  } catch (err) {
    let apiResponse = responseLib.generate(true, `${err.message}`, null);
    res.status(500);
    res.send(apiResponse);
  }
};

let rateLimiterByIP = (secondsWindow = 60, allowedHits = 5) => {
  try {
    return async (req, res, next) => {
      let client = require("../../../api-server/www/db/db").redis_client;
      //await client.connect();
      let counter_id =
        req.connection.remoteAddress + "://" + req.connection.remotePort;
      let requests = await client.incr(counter_id);
      let ttl;
      if (requests == 1) {
        await client.expire(counter_id, secondsWindow);
        ttl = secondsWindow;
      } else {
        ttl = await client.ttl(counter_id);
      }
      //await client.disconnect();
      if (requests > allowedHits) {
        let apiResponse = responseLib.generate(
          true,
          `Too many Requests..Try after cool-down`,
          { callsInAMinute: requests, ttl: ttl }
        );
        res.status(429).send(apiResponse);
      } else {
        next();
      }
    };
  } catch (err) {
    let apiResponse = responseLib.generate(true, `${err.message}`, null);
    res.status(500);
    res.send(apiResponse);
  }
};

let rateLimiterV2 = async (
  usercode,
  miliSecondsWindow = appConfig.RL_DEFAULT_MS,
  allowedHits = 1,
  action = null,
  sub_actions = [],
  client_id = null
) => {
  let client = require("../../www/db/db").redisGlobalClient;
  try {
    let counter_id = usercode + "-" + action;
    let sub_action_ttl;
    let ttl;

    if (sub_actions.length > 0) {
      await Promise.all(
        sub_actions.map(async (sub_action) => {
          if (["cl-add", "cl-subtract"].includes(sub_action.name)) {
            sub_action_ttl = await client.pTTL(client_id + "-" + sub_action.name);
          } else {
            sub_action_ttl = await client.pTTL(usercode + "-" + sub_action.name);
          }

          if (
            sub_action_ttl > 0 &&
            sub_action.RL_MS - sub_action_ttl < sub_action.validation_RL_MS
          ) {
            
            return {
              status: false,
              msg: `Too many Requests..Try after cool-down ${sub_action.name}`,
              ttl: sub_action.RL_MS - sub_action_ttl,
              sub_action: sub_action.name,
            };
          }
        })
      );
    }

    let requests = await client.incr(counter_id);
    //console.log(requests);
    if (requests == 1) {
      await client.pExpire(counter_id, miliSecondsWindow);
      ttl = miliSecondsWindow;
    } else {
      ttl = await client.pTTL(counter_id);
    }

    if (requests > allowedHits) {
      
      return {
        status: false,
        msg: "Too many Requests..Try after cool-down",
        ttl: ttl,
        action: action,
      };
    } else {
      
      return {
        status: true,
        msg: "Valid transaction",
        ttl: ttl,
      };
    }
  } catch (err) {
    
    return {
      status: false,
      msg: `${err.message}`,
      exception: true,
    };
  }
};

module.exports = {
  rateLimiter: rateLimiter,
  rateLimiterByIP: rateLimiterByIP,
  rateLimiterV2: rateLimiterV2,
};
