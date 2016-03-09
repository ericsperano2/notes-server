//var AWS = require('aws-sdk');

var Dev = 'dev';
var Prod = 'prod';

var os = require('os');
var env = (process.env.NOTES_SERVER_ENV && process.env.NOTES_SERVER_ENV === Dev) ? Dev : Prod;
var runningInDev = env === Dev;
var port = process.env.PORT || 3000;

module.exports = {
    env: env,
    runningInDev: runningInDev,
    port: port,
    region: 'us-west-2',

    authentication: {
        google: {
            callbackURL: runningInDev ?
                'http://localhost:' + port + '/auth/login/google/callback' :
                'https://notes.spe.quebec/auth/login/google/callback'
        }
    },
    session: {
        secret: 'keyboard cat',
        table: 'notes-sessions',
        reapInterval: 600000
    },
    statsd: {
        host: runningInDev ? '192.168.99.100' : '',
        port: 8125,
        prefix: 'notes.' + os.hostname().split('.')[0] + '.'
    },
    tables: {
        notes: 'notes'
    }
};

/*
if (module.exports.runningInDev) {
    var credentials = new AWS.SharedIniFileCredentials({profile: 'portfolio_demo'});
    AWS.config.credentials = credentials;
}

AWS.config.update({
    region: 'us-west-2' // TODO????
});
*/
