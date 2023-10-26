
// //const { Sequelize } = require('sequelize');
// const mode = process.env.NODE_ENV;
// const mongoose = require('mongoose');
// const server = require('../rest/server');
// const appConfig = require('../../config/appConfig');
// const db = {};
// const redis = require('redis');
// const dbConfig = require("../../config/dbConfig.json")[mode];
// //let dataAPI = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
// const fs = require('fs');
// //const auth = require("../../src/libs/tokenLib");


// const startDB = (app,db_type)=>{
//     switch(db_type){
//         case "mysql":
//             console.log(`Environment : ${process.env.NODE_ENV} Database : ${process.env.DATABASE_TYPE}`);
//             //Import the sequelize module
//             try{
//                 dataAPI.authenticate()
//                 .then(()=>{
//                     console.log(`Database Connection open Success : ${JSON.stringify(dbConfig.host)}`);
//                     // const redis_client = redis.createClient({
//                     //     url:appConfig.redis_url
//                     // });
                    
//                     // redis_client.on('error', (err) => {
//                     //     console.log("Error " + err)
//                     // });
//                     server.startServer(app);
//                     // module.exports.dataAPI = dataAPI;
//                     //module.exports.redis_client = redis_client;
//                     // // Bootstrap route
//                     console.log('CWD :: ',process.cwd());
//                     const schemaPath = `${process.cwd()}/src/models`;
//                     //Bootstrap models
//                     // fs.readdirSync(schemaPath).forEach(function (file) {
//                     // if (~file.indexOf('.js')) require(schemaPath + '/' + file)
//                     // });
//                     // // end Bootstrap models
//                     // const routesPath = `${process.cwd()}/src/routes`;
//                     // fs.readdirSync(routesPath).forEach(function (file) {
//                     // if (~file.indexOf('.js')) {
//                     //     let route = require(routesPath + '/' + file);
//                     //     route.setRouter(app);
//                     // }
//                     // });
//                     // // end bootstrap route
                    
//                 });
//             }catch(err){
//                 console.log(`Database Connection Open Error : ${err}`);
//             }

//             break;
//         case "mongo" :
//             console.log(`Environment : ${process.env.NODE_ENV} Database : ${process.env.DATABASE_TYPE}`);
//             try{
//                 /**
//                  * database connection settings
//                  */

               
//                 // const mongoose = require("mongoose");
//                 mongoose.connect(appConfig.db.uri, { useNewUrlParser: true });

//                 mongoose.connection.on("error", function (err) {
//                 console.log(`database error:${err}`);
//                 process.exit(1);
//                 }); // end mongoose connection error

//                 mongoose.connection.on("open", async function (err) {
//                 if (err) {
//                     console.log(`database error:${JSON.stringify(err)}`);
//                     process.exit(1);
//                 } else {
//                     console.log("database connection open success");
//                     // const redis_client = redis.createClient({
//                     //     url:appConfig.redis_url
//                     // });
//                     // redis_client.connect();
//                     // redis_client.on('error', (err) => {
//                     //     console.log("REDIS Error " + err)
//                     // });
//                     // module.exports.redis_client = redis_client;
//                     /**
//                      * Create HTTP server.
//                      */
//                     server.startServer(app);
                
//                     const schemaPath = `${process.cwd()}/src/models`;
//                     //Bootstrap models
//                     fs.readdirSync(schemaPath).forEach(function (file) {
//                     if (~file.indexOf('.js')) require(schemaPath + '/' + file)
//                     });
//                     // end Bootstrap models
//                     const routesPath = `${process.cwd()}/src/routes`;
//                     fs.readdirSync(routesPath).forEach(function (file) {
//                     if (~file.indexOf('.js')) {
//                         let route = require(routesPath + '/' + file);
//                         route.setRouter(app);
//                     }
//                     });
//                     // // end bootstrap route

//                 }
//                 }); // end mongoose connection open handler
//             }catch(err){
//                console.log(`Database Connection Open Error : ${err}`);
//            }
//             break;

//         default:
//             console.log('No Database Connected,webserver will not start!');
//     }
// }
// mongoose.set('debug', true);


// module.exports = {
//     startDB : startDB
    
// }



let dataAPI;
const mode = process.env.NODE_ENV;
const server = require('../rest/server');
const appConfig = require('../../config/appConfig');
//const redis = require('../../src/libs/redisLib');

/**
 * Proceed with Multiple databases connection from ENV
 * @author Rajdeep Adhikary
 * @param {Object} app - The application object.
 * @param {String} db_type - The comma-separated string of database types.
 * @returns {Promise<void>} - A promise that resolves once all database connections are established and the server is started.
 */


const startDB = (app, db_type) => {
  switch (db_type) {
    case "mongo":
      // console.log(`Environment : ${process.env.NODE_ENV} Database : ${process.env.DATABASE_TYPE}`);
      try {
        /**
         * database connection settings
         */
        const dbConfig = require("../../config/dbConfig.json")[process.env.NODE_ENV][process.env.DATABASE_TYPE];
        // console.log(dbConfig.uri);
        // console.log(appConfig.db.uri)
        const mongoose = require('mongoose');
        // mongoose.connect(dbConfig.uri, { useNewUrlParser: true });
        mongoose.connect(appConfig.db.uri, { useNewUrlParser: true });

        //mongoose.set('debug', true);

        mongoose.connection.on('error', function (err) {
          console.log(`database error:${err}`);
          process.exit(1)
        }); // end mongoose connection error

        mongoose.connection.on('open', async function (err) {
          if (err) {
            console.log(`database error:${JSON.stringify(err)}`);
            process.exit(1)
          } else {
            console.log("database connection open success");
            server.startServer(app);

            // create Redis Client & export
            // if(await redis.connect()){
            //   const commonController = require('../../src/controllers/commonController');
            
            //   let isProviderInRedis = await commonController.setProviderInRedis();

            //   if(isProviderInRedis){
            //     /**
            //      * Create HTTP server.
            //      */
                
            //   }
            //   else{
            //     console.log(`Redis Error : Unable to store provider details on redis`);
            //     process.exit(1)
            //   }
            // }
            // else{
            //   console.log(`Redis Error : Unable to connect to redis`);
            //   process.exit(1)
            // } 
          }
        }); // end mongoose connection open handler
      } catch (err) {
        console.log(`Database Connection Open Error : ${err}`);
      }
      break;

    default:
      console.log('No Database Connected,webserver will not start!');
  }
}

module.exports = {
  startDB: startDB
}
