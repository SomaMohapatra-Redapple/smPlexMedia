
let dataAPI;
const mode = process.env.NODE_ENV;
const server = require('../rest/server');
const appConfig = require('../../config/appConfig');

/**
 * Proceed with Multiple databases connection from ENV
 * @author Injamamul Hoque
 * @param {Object} app - The application object.
 * @param {String} db_type - The comma-separated string of database types.
 * @returns {Promise<void>} - A promise that resolves once all database connections are established and the server is started.
 */


const startDB = (app, db_type) => {
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
      //console.log(`Environment : ${process.env.NODE_ENV} Database : ${process.env.DATABASE_TYPE}`);
      try {
        /**
         * database connection settings
         */
        const dbConfig = require("../../config/dbConfig.json")[process.env.NODE_ENV][process.env.DATABASE_TYPE];
        const mongoose = require('mongoose');
        mongoose.connect(appConfig.db.uri, { useNewUrlParser: true });

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
          mongoose.set('debug', true);
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

