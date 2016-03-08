'use strict';

var pathHealthcheck = '/healthcheck';

var expressSession = require('express-session');
var passport = require('passport');
var logger = require('../logger');
var config = require('../config');

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function(user, callback) {
    callback(null, user);
});

passport.deserializeUser(function(obj, callback) {
    callback(null, obj);
});

var getSessionStore = function(session) {
    logger.debug('Creating DynamoDB session store...');
    var DynamoDBStore = require('connect-dynamodb')({session: session});
    var options = {
        table: config.session.table,
        AWSConfigJSON: {
            region: config.region,
            //correctClockSkew: true
        },
        reapInterval: config.session.reapInterval
    };
    var store = new DynamoDBStore(options);
    logger.debug('DynamoDB session store created:', store);
    return store;
};

var useGoogleStrategy = function() {
    logger.info('Using Google strategy for passport.');
    passport.use(require('./strategies/google'));
};

useGoogleStrategy();

module.exports = {
    sessionStore: getSessionStore(expressSession),

    session: function(req, res, next) {
        if (req.path === pathHealthcheck) {
            logger.debug('no session for ' + pathHealthcheck);
            next();
        } else {
            expressSession({
                secret: config.session.secret,
                store: module.exports.sessionStore,
                resave: true, // TODO purpose?
                saveUninitialized: true // TODO Purpose?
            })(req, res, next);
        }
    },

    setup: function(app) {
        logger.debug('Initializing express session...');
        app.use(module.exports.session);
        // Initialize Passport and restore authentication state, if any, from the session.
        logger.debug('Initializing passport...');
        app.use(passport.initialize());
        app.use(passport.session());

        if (!config.runningInDev) {
            // do not force ssl for the healthcheck
            app.use(function requireHTTPS(req, res, next) {
                if (req.path !== pathHealthcheck && !req.secure && req.get('X-Forwarded-Proto') !== 'https') {
                    return res.redirect('https://' + req.headers.host + req.url);
                }
                next();
            });
        }
        logger.info('Authentication module ready.');
    }
};
/*
module.exports = {

    setup: function() {
        this.useGoogleStrategy();
    },


    sessionStore: function() {

    },


    setupSessions: function() {
        /*
        app.use(session({
            secret: sessionSecret,
            store: sessionStore,
            resave: true,
            saveUninitialized: true
        }));*
        app.use(function(req, res, next){
            if (req.path === '/healthcheck') {
                console.log("no session for /healthcheck");
                next();
            } else {//otherwise run session
                session({
                    secret: sessionSecret,
                    store: sessionStore,
                    resave: true, // TODO purpose?
                    saveUninitialized: true // TODO Purpose?
                })(req, res, next);
            }
        });

    }
};
*/
