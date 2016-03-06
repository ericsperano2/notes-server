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
        callbackURL: 'http://localhost:3000/login/google/callback'
    },
    function(accessToken, refreshToken, profile, cb) {
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

/*
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
*/
// TODO share: middleware
//var GitkitClient = require('gitkitclient');
//var gitkitClient = new GitkitClient(JSON.parse(fs.readFileSync(config.gitkit.serverConfig)));

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
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
//app.use(morgan('dev'));

if (!process.env.NOTES_SERVER_ENV || process.env.NOTES_SERVER_ENV !== 'dev') {
    app.use(function requireHTTPS(req, res, next) {
        console.log('forwarded proto', req.get('X-Forwarded-Proto'));
        if (req.path !== '/healthcheck' && !req.secure && req.get('X-Forwarded-Proto') !== 'https') {
            return res.redirect('https://' + req.headers.host + req.url);
        }
        next();
    });
}

app.use(require('./controllers'));

//app.get('/login/google', passport.authenticate('google', {scope: ['profile']}));
/*

app.get('/login/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });
*/

// widget page hosting Gitkit javascript
//app.get('/gitkit', renderGitkitWidgetPage);
//app.post('/gitkit', renderGitkitWidgetPage);

// Ajax endpoint to send email for password-recovery and email change event
/*
app.post('/sendemail', renderSendEmailPage);
*/
//function renderGitkitWidgetPage(req, res) {
    //res.writeHead(200, {'Content-Type': 'text/html'});
    //var html = new Buffer(fs.readFileSync('./views/gitkit-widget.html')).toString();
    //html = html.replace('%%postBody%%', encodeURIComponent(req.body || ''));
    //res.end(html);
//    res.render('gitkit-widget', {widgetUrl: config.gitkit.widgetUrl, postBody: encodeURIComponent(req.body || '')});
//}
/*
function renderSendEmailPage(req, res) {
    app.disable('etag');
    gitkitClient.getOobResult(req.body, req.ip, req.cookies.gtoken, function(err, resp) {
        if (err) {
            console.log('Error: ' + JSON.stringify(err));
        } else {
            // Add code here to send email
            console.log('Send email: ' + JSON.stringify(resp));
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(resp.responseBody);
    });
}
*/

io = io.listen(app.listen(port, function() {
    console.log(clc.bold.cyan(config.appTitle), 'version', clc.bold.cyan(packageJson.version),
        'listening on port', clc.bold.green(String(port)) + '.');
    console.log();
}));

websocket(io);

/*
app.listen(port, function() {
    console.log(clc.bold.cyan(config.appTitle), 'version', clc.bold.cyan(packageJson.version),
        'listening on port', clc.bold.green(String(port)) + '.');
    console.log();
});
*/
