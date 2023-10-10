
let dataAPI;
const mode = process.env.NODE_ENV;
const server = require('../rest/server');
const appConfig = require('../../config/appConfig');
const redis = require('../../src/libs/redisLib');

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

            // create Redis Client & export
            if(await redis.connect()){
              const commonController = require('../../src/controllers/commonController');
            
              let isProviderInRedis = await commonController.setProviderInRedis();

              if(isProviderInRedis){
                /**
                 * Create HTTP server.
                 */
                server.startServer(app);
              }
              else{
                console.log(`Redis Error : Unable to store provider details on redis`);
                process.exit(1)
              }
            }
            else{
              console.log(`Redis Error : Unable to connect to redis`);
              process.exit(1)
            } 
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

