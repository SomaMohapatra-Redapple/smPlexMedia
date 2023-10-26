const dbConfig = require('./dbConfig.json')[process.env.NODE_ENV];
const serverLib = require('../src/libs/serverLib');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const rngClass = require('../src/algo/rng');
const pRNG = new rngClass();
const sever = new serverLib();

let appConfig = {};

appConfig.eventEmitter = eventEmitter;
appConfig.allowedCorsOrigin = "*";
appConfig.apiVersion = '/api/v1';
appConfig.socketNameSpace = 'wsio';
appConfig.sessionExpTime = (3600 * 2);
appConfig.redis_url = dbConfig.redis.url;
appConfig.apiService = sever;

appConfig.MSG_1000 ='Oops! Something went wrong...';
appConfig.db = {
    uri: `mongodb://${dbConfig.username}:${encodeURIComponent(dbConfig.password)}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?authSource=admin`
};

module.exports = appConfig;