const dbConfig = require('./dbConfig.json')[process.env.NODE_ENV]
const events = require('events');
const eventEmitter = new events.EventEmitter();
const rngClass = require('../src/algo/rng');
const pRNG = new rngClass();

let appConfig = {};

appConfig.eventEmitter = eventEmitter;
appConfig.allowedCorsOrigin = "*";
appConfig.apiVersion = '/api/v1';
appConfig.socketNameSpace = 'wsio';
appConfig.sessionExpTime = (120 * 120);

appConfig.MSG_1000 ='Oops! Something went wrong...';

module.exports = appConfig;