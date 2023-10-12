
let dataAPI;
const mode = process.env.NODE_ENV;
const server = require('../../../api-server/www/rest/server');
const appConfig = require('../../config/appConfig');

/**
 * Proceed with Multiple databases connection from ENV
 * @author Akash Paul
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
        const dbConfig = require('../../config/dbConfig.json')[process.env.NODE_ENV][process.env.DATABASE_TYPE];
        const mongoose = require('mongoose');
        mongoose.connect(appConfig.db.uri, { useNewUrlParser: true });
        //mongoose.set('debug', true);

        mongoose.connection.on('error', function (err) {
          console.log(`database error:${err}`);
          process.exit(1)
        }); // end mongoose connection error

        mongoose.connection.on('open', function (err) {
          if (err) {
            console.log(`database error:${JSON.stringify(err)}`);
            process.exit(1)
          } else {
            console.log("database connection open success");
            // const redis_client = redis.createClient({
            //     url:appConfig.redis_url
            // });
            // redis_client.connect();
            // redis_client.on('error', (err) => {
            //     console.log("REDIS Error " + err)
            // });
            // module.exports.redis_client = redis_client;
            /**
             * Create HTTP server.
             */
            server.startServer(app);
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


// const startDB = async (app, db_type) => {
//   try {
//     // Split the db_type string into an array of database types
//     const databaseTypes = db_type.split(",");
//     console.log('databaseTypes ==>', databaseTypes);
//     // Create an array of promises that represent each database connection
//     const connectionPromises = databaseTypes.map((type) => connectionHandler(type));

//     // Wait for all promises to settle (either fulfilled or rejected) using Promise.all
//     let awt = await Promise.all(connectionPromises);
//     console.log('Promises response ==>', awt);
//     server.startServer(app);
//     // Once all database connections are established, start the server
//     // server.startServer(app);
//   } catch (err) {
//     // If there is an error connecting to a database, log the error and the path to the database file
//     console.log(`DATABASE CONNECTION ERROR: PATH /www/db/db.js\n${err}`);
//   }
// };

// /**
//  * Function to open a database connection.
//  * @param {String} db_type - The type of database.
//  * @returns {Promise<String>} - A promise that resolves with a string indicating the status of the database connection.
//  */
// const connectionHandler = (db_type) => {
//   return new Promise((resolve, reject) => {
//     switch (db_type) {
//       case "mysql":
//         console.log(`Environment: ${process.env.NODE_ENV} Database: ${db_type}`);
//         const { Sequelize } = require("sequelize")
//         // Import the sequelize module
//         const dbConfigMySql = require("../../../api-server/config/dbConfig.json")[mode][db_type];
//         dataAPI = new Sequelize(dbConfigMySql.database, dbConfigMySql.username, dbConfigMySql.password, dbConfigMySql);
//         dataAPI.authenticate()
//           .then(() => {
//             module.exports.dataAPI = dataAPI;
//             console.log(`MySQL database connection open success: ${JSON.stringify(dbConfigMySql.host)}`);
//             resolve("MySQLDONE");
//           })
//           .catch((err) => {
//             console.log(`MySQL database connection open error: ${err}`);
//             reject("MySQLERROR");
//           });
//         break;
//       case "mongo":
//         console.log(`Environment: ${process.env.NODE_ENV} Database: ${db_type}`);
//         const mongoose = require('mongoose');
//         // Import the mongoose module
//         const dbConfigMongo = require("../../../api-server/config/dbConfig.json")[mode][db_type];
//         mongoose.connect(dbConfigMongo.uri, { useNewUrlParser: true });
//         mongoose.connection.on("error", (err) => {
//           console.log(`MongoDB database connection error: ${err}`);
//           reject("mongoDBERROR");
//         });
//         mongoose.connection.once("open", () => {
//           console.log("MongoDB database connection open success");
//           resolve("mongoDBDONE");
//         });
//         mongoose.set('debug', true);
//         break;
//       case "redis":
//         console.log(`Environment: ${process.env.NODE_ENV} Database: ${db_type}`);
//         const redis = require('redis');
//         const dbConfigRedis = require("../../../api-server/config/dbConfig.json")[mode][db_type];
//         console.log('DBConfig ==>', dbConfigRedis);
//         const redis_client = redis.createClient({
//           url: dbConfigRedis.url,
//         });
//         redis_client.connect();
//         redis_client.on("connect", () => {
//           console.log("Redis connected successfully!");
//           module.exports.redis_client = redis_client;
//           resolve("redisDONE");
//         });
//         redis_client.on("error", (err) => {
//           console.log(`Redis connection error: ${err}`);
//           reject("redisERROR");
//         });
//         break;
//       case "redisGlobal":
//         console.log(`Environment: ${process.env.NODE_ENV} Database: ${db_type}`);
//         const redisGlobal = require('redis');
//         const redisConfig = require("../../config/redisConfig.json")[mode];
//         const redisGlobalClient = redisGlobal.createClient({
//           url: redisConfig.url,
//           password: redisConfig.password
//         });
//         redisGlobalClient.connect();
//         redisGlobalClient.on("connect", () => {
//           console.log("Global Redis connected successfully!");
//           module.exports.redisGlobalClient = redisGlobalClient;
//           resolve("globalRedisDONE");
//         });
//         redisGlobalClient.on("error", (err) => {
//           console.log(`Global Redis connection error: ${err}`);
//           reject("globalRedisERROR");
//         });
//         break;
//       default:
//         console.log("No database connected. The webserver will not start.");
//         reject("NODB");
//     }
//   });
// };



module.exports = {
  startDB: startDB
}

