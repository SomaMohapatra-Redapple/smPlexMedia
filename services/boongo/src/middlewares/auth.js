const responseLib = require('../libs/responseLib');
const token = require('../libs/tokenLib');
const check = require('../libs/checkLib');
const appConfig = require('../../config/appConfig');
const controller = require('../controllers/commonController'); 

let isAuthorized = async (req, res, next) => {
  try{
    const tokenStr = req.body.args.token;
    const uid = req.body.uid;
    const mode = "REAL";
    let tokenValidate = tokenStr.includes('-ucd-');

    if (tokenValidate == false) {
      let apiResponse = {
        uid: uid,
        error: {
          code: 'INVALID_TOKEN'
        }
      }
      res.status(403)
      res.send(apiResponse)
    }
    let playerToken = tokenStr.split("-ucd-");
    let usercode = playerToken[1];
    const userdtls = await controller.checkUsercodeExists(usercode);

    if (userdtls) {
      next();
    }
    else{
      let apiResponse = {
        uid: uid,
        error: {
          code: 'INVALID_TOKEN'
        }
      }
      res.status(403)
      res.send(apiResponse)
    }
  }catch(err){
    let apiResponse = {
      uid: req.body.uid,
      error: {
        code: 'INVALID_TOKEN'
      }
    }
    res.status(403)
    res.send(apiResponse)
  }
}

let firebaseAuth = async (req,res,next) => {
  if (req.header('token') && !check.isEmpty(req.header('token'))) {
    try{
      let checkAuth = await appConfig.admin.auth().verifyIdToken(req.header('token'));
      next();
    }catch(err){
      let apiResponse = responseLib.generate(0, `${err.message}`, null)
      res.status(401).send(apiResponse)
    }
  } else {
    let apiResponse = responseLib.generate(0, 'AuthorizationToken Is Missing In Request', null)
    res.status(401).send(apiResponse)
  }
}

let isAuthorizedSocket = async (socket,next) => {
  try {
    let socketToken;
   //console.log("JWT token,", socket.handshake);
    if (socket.handshake.headers.auth_token || socket.handshake.query.auth_token) {
        socketToken = socket.handshake.headers.auth_token || socket.handshake.query.auth_token;
    }

    const decoded = await token.verifyClaimWithoutSecret(socketToken);

    if (!decoded) {
        console.log("Invalid token");
    }
    socket.user = decoded.data

    next();
} catch (err) {
    console.log('ERROR => ' + err);
}
}

module.exports = {
  isAuthorized: isAuthorized,
  firebaseAuth:firebaseAuth,
  isAuthorizedSocket:isAuthorizedSocket
}
