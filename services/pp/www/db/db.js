
let dataAPI;
// const mode = process.env.NODE_ENV;
const redis = require('redis');
const server = require('../rest/server');
const appConfig = require('../../config/appConfig');
const redisLib = require('../../src/libs/redisLib');
let redisClient;

/**
 * Proceed with Multiple databases connection from ENV
 * @author Akash Paul
 * @param {Object} app - The application object.
 * @param {String} db_type - The comma-separated string of database types.
 * @returns {Promise<void>} - A promise that resolves once all database connections are established and the server is started.
 */


const startDB = async (app, db_type) => {
  switch (db_type) {
    case "mysql":
      console.log(`Environment : ${process.env.NODE_ENV} Database : ${process.env.DATABASE_TYPE}`);
      //Import the sequelize module

      const dbConfig = require("../../config/dbConfig.json")[mode];
      dataAPI = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
      try {
        dataAPI.authenticate()
          .then(() => {
            console.log(`Database Connection open Success : ${JSON.stringify(dbConfig.host)}`);
            const redis_client = redis.createClient({
              url: appConfig.redis_url
            });

            redis_client.on('error', (err) => {
              console.log("Error " + err)
            });
            server.startServer(app);
            module.exports.dataAPI = dataAPI;
            module.exports.redis_client = redis_client;

          });
      } catch (err) {
        console.log(`Database Connection Open Error : ${err}`);
      }

      break;
    case "mongo":
      // console.log(`Environment : ${process.env.NODE_ENV} Database : ${process.env.DATABASE_TYPE}`);
      try {
        /**
         * database connection settings
         */
        // const dbConfig = require("../../config/dbConfig.json")[process.env.NODE_ENV][process.env.DATABASE_TYPE];

        const mongoose = require('mongoose');
        mongoose.connect(appConfig.db.uri, { useNewUrlParser: true });
        // mongoose.connect(dbConfig.uri, { useNewUrlParser: true });

        // console.log(dbConfig.uri);
        // console.log(appConfig.db.uri)

        mongoose.set('debug', true);

        // mongoose connection error
        mongoose.connection.on('error', function (err) {
          console.log(`database error:${err}`);
          process.exit(1)
        });

        // mongoose connection open handler
        mongoose.connection.on('open', async function (err) {
          if (err) {
            console.log(`database error:${JSON.stringify(err)}`);
            process.exit(1);
          } else {
            console.log("mongo database connection open success");
            
            let redisConnect = await redisLib.connect(appConfig.redis_url);

            if (redisConnect == true) {
              const commonController = require('../../src/controller/commonController');
              commonController.setProviderInRedis();

              /* Create HTTP server */
              server.startServer(app);
            } else {
              console.log("server connection failed");
            }
          }
        });

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

