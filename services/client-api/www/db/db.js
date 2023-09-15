
let dataAPI;
const server = require('../rest/server');
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

        const mongoose = require('mongoose');
        mongoose.connect(appConfig.db.uri, { useNewUrlParser: true });
        // mongoose.connect(dbConfig.uri, { useNewUrlParser: true });

        mongoose.set('debug', true);

        // mongoose connection error
        mongoose.connection.on('error', function (err) {
          console.log(`database error:${err}`);
          process.exit(1)
        });

        // mongoose connection open handler
        mongoose.connection.on('open', function (err) {
          if (err) {
            console.log(`database error:${JSON.stringify(err)}`);
            process.exit(1)
          } else {
            console.log("database connection open success");
            
            /**
             * Create HTTP server.
             */
            server.startServer(app);
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

