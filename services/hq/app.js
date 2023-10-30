const envConf = require('dotenv').config({ debug: process.env.DEBUG });

if (envConf.error) {
  throw envConf.error
}

const express = require('express');

const appConfig = require('./config/appConfig');
const routeLoggerMiddleware = require('./src/middlewares/routeLogger');
const globalErrorMiddleware = require('./src/middlewares/appErrorHandler');
const fs = require('fs');
const path = require('path');
const database = require('./www/db/db');
const server = require('./www/rest/server');

const app = express();

app.use(function (req, res, next) {
  delete req.headers['content-encoding']
  next()
})

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(routeLoggerMiddleware.logIp);
app.use(globalErrorMiddleware.globalErrorHandler);

app.all(appConfig.allowedCorsOrigin, function (req, res, next) {
  res.header("Access-Control-Allow-Origin", appConfig.allowedCorsOrigin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,token,key,Authorization");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  next();
});
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

app.use(express.static(path.join(__dirname, 'views')));

//Bootstrap models
const schemaPath = './src/models';
fs.readdirSync(schemaPath).forEach(function (file) {
  if (~file.indexOf('.js')) require(schemaPath + '/' + file)
});

// Bootstrap route
const routesPath = './src/routes';
fs.readdirSync(routesPath).forEach(function (file) {
  if (~file.indexOf('.js')) {
    let route = require(routesPath + '/' + file);
    route.setRouter(app);
  }
});


// Module route bootstrap
// const moduleRoutesPath = './src/routes';
// let routerFunction = (path) => {
//   fs.readdirSync(path).forEach(function (dir) {
//     if (~dir.indexOf('.js')) {
//       let route = require(path + '/' + dir);
//       route.setRouter(app);
//     }
//     let moduleRoute = path + "/" + dir
//     if (fs.lstatSync(moduleRoute).isDirectory()) {
//       routerFunction(moduleRoute)
//     }
//   });
// }
// routerFunction(moduleRoutesPath)
// end bootstrap route

/* Start Database*/

database.startDB(app, process.env.DATABASE_TYPE);