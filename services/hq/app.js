const envConf = require('dotenv').config({ debug: process.env.DEBUG });

if (envConf.error) {
  throw envConf.error
}

const express = require("express");
const database = require("./www/db/db");
const appConfig = require("./config/appConfig");
const routeLoggerMiddleware = require("./src/middlewares/routeLogger");
//const globalErrorMiddleware = require("./src/middlewares/appErrorHandler");
const fs = require("fs");
const path = require("path");
//var cors = require("cors");
const app = express();

//app.use(cors());
//Bootstrap models
fs.readdirSync(schemaPath).forEach(function (file) {
  if (~file.indexOf(".js")) require(schemaPath + "/" + file);
});
// end Bootstrap models
// app.set('views','views');
// app.set('view engine','ejs');
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(routeLoggerMiddleware.logIp);
app.use(globalErrorMiddleware.globalErrorHandler);

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", appConfig.allowedCorsOrigin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,token,key,Content-Encoding");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  next();
});
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});


/* Start Database*/
database.startDB(app, process.env.DATABASE_TYPE);
