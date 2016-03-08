'use strict';

var GoogleStrategy = require('passport-google-oauth20').Strategy;
var config = require('../../config');
var logger = require('../../logger');

// TODO check that the process.env variables exists
module.exports = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: config.authentication.google.callbackURL
},
function(accessToken, refreshToken, profile, callback) {
    logger.debug('GoogleStrategy initialized.');
    //TODO user table:
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return callback(null, profile);
});
