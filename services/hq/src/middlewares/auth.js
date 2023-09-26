const responseLib = require('../libs/responseLib');
const token = require('../libs/tokenLib');
const check = require('../libs/checkLib');
const appConfig = require('../../config/appConfig');

let isAuthorized = async (req, res, next) => {
  console.log("token print ",req.headers.token)
  try{
    if (req.header('token') && !check.isEmpty(req.header('token'))) {
      let decoded = await token.verifyClaimWithoutSecret(req.header('token'));
      console.log("token details ",decoded);
      req.user = decoded ;
      console.log("req.user",  req.user);
      next();
    } else {
      let apiResponse = responseLib.generate(true,'AuthorizationToken Is Missing In Request',null);
      res.status(403)
      res.send(apiResponse)
    }
  }catch(err){
    let apiResponse = responseLib.generate(true,err.message,null);
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
    const decoded = await token.verifyClaimWithoutSecret(socket.handshake.query.token);

    if (!decoded) {
        console.log("Invalid token");
    }
    socket.user = decoded.data

    next();
} catch (err) {
    console.log('ERROR => is' + err);
}
}

module.exports = {
  isAuthorized: isAuthorized,
  firebaseAuth:firebaseAuth,
  isAuthorizedSocket:isAuthorizedSocket
}
