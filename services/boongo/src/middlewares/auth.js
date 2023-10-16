/**
 * 
 * @author Rajdeep Adhikary
 * @purpose Boongo provider API token authorization
 * @createdDate Sep 26 2023
 * @lastUpdated Sep 26 2023
 * @lastUpdatedBy Rajdeep Adhikary
 */

const controller = require('../controllers/commonController'); 

let isAuthorized = async (req, res, next) => {
  try{
    const tokenStr = req.body.token;
    const uid = req.body.uid;
    let tokenValidate = tokenStr.includes('-ucd-');

    if (tokenValidate == false) {
      console.log('no -ucd- in token');
      let apiResponse = {
        uid: uid,
        error: {
          code: 'INVALID_TOKEN'
        }
      }
      res.status(200)
      res.status(200)
      res.send(apiResponse)
    }
    else{
      let playerToken = tokenStr.split("-ucd-");
      let usercode = playerToken[1];
      const userdtls = await controller.checkUsercodeExists(usercode);

      if (userdtls) {
        next();
      }
      else{
        console.log('no user token');
        let apiResponse = {
          uid: uid,
          error: {
            code: 'INVALID_TOKEN'
          }
        }
        res.status(200)
        res.send(apiResponse)
      }
    }
  }catch(err){
    console.log(err.message);
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


module.exports = {
  isAuthorized: isAuthorized,
}
