var AWS = require('aws-sdk');

var Dev = 'dev';
var Prod = 'prod';

var CallbackURLDev = 'http://localhost:3000/login/google/callback';
var CallbackURLProd = 'https://notes.spe.quebec/login/google/callback';

var Env = (process.env.NOTES_SERVER_ENV && process.env.NOTES_SERVER_ENV === Dev) ? Dev : Prod;

module.exports = {
    env: Env,
    runningInDev: Env === Dev,

    authentication: {
        google: {
            callbackURL: Env === Dev ? CallbackURLDev : CallbackURLProd,
        }
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
*/

console.log('Running in ' + module.exports.env + ' environment.');
AWS.config.update({
    region: 'us-west-2' // TODO????
});
