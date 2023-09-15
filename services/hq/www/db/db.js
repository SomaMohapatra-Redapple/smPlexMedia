
//const { Sequelize } = require('sequelize');
const mode = process.env.NODE_ENV;
const mongoose = require('mongoose');
const server = require('../rest/server');
const appConfig = require('../../config/appConfig');
const db = {};
const redis = require('redis');
const dbConfig = require("../../config/dbConfig.json")[mode];
//let dataAPI = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
const fs = require('fs');
//const auth = require("../../src/libs/tokenLib");


const startDB = (app,db_type)=>{
    switch(db_type){
        case "mysql":
            console.log(`Environment : ${process.env.NODE_ENV} Database : ${process.env.DATABASE_TYPE}`);
            //Import the sequelize module
            try{
                dataAPI.authenticate()
                .then(()=>{
                    console.log(`Database Connection open Success : ${JSON.stringify(dbConfig.host)}`);
                    // const redis_client = redis.createClient({
                    //     url:appConfig.redis_url
                    // });
                    
                    // redis_client.on('error', (err) => {
                    //     console.log("Error " + err)
                    // });
                    server.startServer(app);
                    // module.exports.dataAPI = dataAPI;
                    //module.exports.redis_client = redis_client;
                    // // Bootstrap route
                    console.log('CWD :: ',process.cwd());
                    const schemaPath = `${process.cwd()}/src/models`;
                    //Bootstrap models
                    fs.readdirSync(schemaPath).forEach(function (file) {
                    if (~file.indexOf('.js')) require(schemaPath + '/' + file)
                    });
                    // end Bootstrap models
                    const routesPath = `${process.cwd()}/src/routes`;
                    fs.readdirSync(routesPath).forEach(function (file) {
                    if (~file.indexOf('.js')) {
                        let route = require(routesPath + '/' + file);
                        route.setRouter(app);
                    }
                    });
                    // // end bootstrap route
                    
                });
            }catch(err){
                console.log(`Database Connection Open Error : ${err}`);
            }

            break;
        case "mongo" :
            console.log(`Environment : ${process.env.NODE_ENV} Database : ${process.env.DATABASE_TYPE}`);
            try{
                /**
                 * database connection settings
                 */
                console.log("appConfig.db.uri",appConfig.db.uri);
                mongoose.connect(appConfig.db.uri,{ useNewUrlParser: true});
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
                    const redis_client = redis.createClient({
                        url:appConfig.redis_url
                    });
                    redis_client.connect();
                    redis_client.on('error', (err) => {
                        console.log("REDIS Error " + err)
                    });
                    module.exports.redis_client = redis_client;
                    /**
                     * Create HTTP server.
                     */
                    server.startServer(app);
                    console.log('CWD :: ',process.cwd());
                    const schemaPath = `${process.cwd()}/src/models`;
                    //Bootstrap models
                    fs.readdirSync(schemaPath).forEach(function (file) {
                    if (~file.indexOf('.js')) require(schemaPath + '/' + file)
                    });
                    // end Bootstrap models
                    const routesPath = `${process.cwd()}/src/routes`;
                    fs.readdirSync(routesPath).forEach(function (file) {
                    if (~file.indexOf('.js')) {
                        let route = require(routesPath + '/' + file);
                        route.setRouter(app);
                    }
                    });
                    // // end bootstrap route
                }
                }); // end mongoose connection open handler
            }catch(err){
                console.log(`Database Connection Open Error : ${err}`);
            }
            break;

        default:
            console.log('No Database Connected,webserver will not start!');
    }
}
mongoose.set('debug', true);


module.exports = {
    startDB : startDB
    
}