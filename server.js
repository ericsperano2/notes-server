'use strict';

//var fs = require('fs');
var express = require('express');
//var morgan = require('morgan');
var hbs = require('express-handlebars');
var path = require('path');
var app = express();
var port = process.env.PORT || 3000;
//var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
var clc = require('cli-color');
var config = require('./config/config');
var packageJson = require('./package.json');
var io = require('socket.io');
var websocket = require('./controllers/websocket');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: config.authentication.google.callbackURL
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log('passport.use - google strategy:', accessToken, refreshToken);
        // In this example, the user's Facebook profile is supplied as the user
        // record.  In a production-quality application, the Facebook profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        return cb(null, profile);
    })
);

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

app.set('views', path.join(__dirname, 'views'));

app.engine('html', hbs({
    extname: '.html'
}));
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('dev')); // combined
//app.use(require('cookie-parser')());
//app.use(require('body-parser').urlencoded({ extended: true }));
//app.use(bodyParser.json());
var session = require('express-session');
var DynamoDBStore = require('connect-dynamodb')({session: session});
var options = {
    // Name of the table you would like to use for sessions.
    // Defaults to 'sessions'
    table: 'notes-sessions',

    // Optional path to AWS credentials (loads credentials from environment variables by default)
    // AWSConfigPath: './path/to/credentials.json',

    // Optional JSON object of AWS configuration options
    AWSConfigJSON: {
        region: 'us-west-2',
    //     correctClockSkew: true
    },

    // Optional. How often expired sessions should be cleaned up.
    // Defaults to 600000 (10 minutes).
    reapInterval: 600000
};

app.use(session({
    secret: 'keyboard cat',
    store: new DynamoDBStore(options),
    resave: true,
    saveUninitialized: true
}));

/*

*/

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
//app.use(morgan('dev'));

if (!process.env.NOTES_SERVER_ENV || process.env.NOTES_SERVER_ENV !== 'dev') {
    app.use(function requireHTTPS(req, res, next) {
        if (req.path !== '/healthcheck' && !req.secure && req.get('X-Forwarded-Proto') !== 'https') {
            return res.redirect('https://' + req.headers.host + req.url);
        }
        next();
    });
}

app.use(require('./controllers'));

io = io.listen(app.listen(port, function() {
    console.log(clc.bold.cyan(config.appTitle), 'version', clc.bold.cyan(packageJson.version),
        'listening on port', clc.bold.green(String(port)) + '.');
    console.log();
}));

websocket(io);
