// const jwt = require('jsonwebtoken');
// const shortid = require('shortid');
// const secretKey = process.env.ENC_KEY;
// const time = require('./timeLib');
// const config = require('../../config/appConfig');



// let generateToken = (data) => {
//   return new Promise((resolve,reject)=>{
//     try{
//       let claims = {
//         jwtid: shortid.generate(),
//         iat: Date.now(),
//         exp: Math.floor(Date.now()/1000) + config.sessionExpTime,
//         sub: 'auth_token',
//         data: data
//       }
//       resolve(jwt.sign(claims, secretKey));      
//     }catch(err){
//       reject(err);
//     }
//   });
// }
// let verifyClaim = (token,secret,cb) => {
//   // verify a token symmetric
//   jwt.verify(token, secret, function (err, decoded) {
//     if(err){
//       cb(err,null)
//     }
//     else{
//       cb(null,decoded);
//     }
//    });
// }// end verify claim 

// let verifyClaimWithoutSecret = (token) => {
//   return new Promise((resolve,reject)=>{
//     jwt.verify(token, secretKey, function (err, decoded) {
//       if(err){
//         reject(err)
//       }
//       else{
//         resolve(decoded);
//       }  
//     });
//   })
// }
// module.exports = {
//   generateToken: generateToken,
//   verifyToken :verifyClaim,
//   verifyClaimWithoutSecret :verifyClaimWithoutSecret
// }

const jwt = require('jsonwebtoken') ;
const apiError = require("./apiError") ;
const responseMessage = require("./responseMessage") ;
module.exports = {
  async verifyToken(req, res, next) {
    
    console.log("I am req.token",req.headers.token)
    if (req.headers.token) {
      jwt.verify(req.headers.token, process.env.ENC_KEY, (err, result) => {
        if (err) {
          console.log("err",err);//throw apiError.unauthorized();
        }
        else {
          console.log("i am result",result);
          //console.log("I am req.token",req.headers.token);
          console.log("I am result_id",result.id);
          
          req.client_id = result.id;
          // clientModel.findOne({where : { client_id: result.id }}).then(data => {
          //   res.status(200).send({
              
          //       data :data, message : responseMessage.CLIENT_CREATED
          //   });
          // })
          // .catch(err => {
          //   res.status(500).send({
          //     message:
          //       err.message || responseMessage.CLIENT_NOT_CREATED
          //   });
          // });
          
          
          
        }
        
      })
    } else {
      // res.status(200).send({
      //   error : true,
      //   message : "please provide token"
      // })
      throw apiError.badRequest(responseMessage.NO_TOKEN);
    }
    next();
  },
  
async verifyClaimWithoutSecret(token)  {
  return new Promise((resolve,reject)=>{
    jwt.verify(token, process.env.ENC_KEY, function (err, decoded) {
      if(err){
        reject(err)
      }
      else{
        resolve(decoded);
      }  
    });
  })
  
  
}
}