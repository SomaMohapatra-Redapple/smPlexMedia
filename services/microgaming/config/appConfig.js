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
appConfig.provider_id = "65142a47b0aef485da243a28"; // provider id of gp
appConfig.redis_url ='redis://18.162.166.6:6379';

appConfig.MSG_1000 ='Oops! Something went wrong...';
appConfig.db = {
    uri: `mongodb://${dbConfig.username}:${encodeURIComponent(dbConfig.password)}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}?authSource=admin`
};

module.exports = appConfig;