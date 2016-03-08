'use strict';

var CookieName = 'connect.sid'; // the name of the cookie where express/connect stores its session_id

var express = require('express');
var hbs = require('express-handlebars');
var path = require('path');
//var clc = require('cli-color');
//var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser'); // TODO why does it hangs?

var io = require('socket.io');
var passportSocketIo = require('passport.socketio');

var packageJson = require('./package.json');
var config = require('./config');
var logger = require('./logger');
var auth = require('./auth');
var websocket = require('./controllers/websocket');

var app = express();

// ====================================================================================================================
// Setting up Morgan for HTTP statistics
app.use(require('morgan')('combined'));

// ====================================================================================================================
// Setting up Views
app.set('views', path.join(__dirname, 'views'));

app.engine('html', hbs({
    extname: '.html'
}));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

/*
//app.use(cookieParser);
//app.use(require('body-parser').urlencoded({ extended: true }));
//app.use(bodyParser.json());
*/

// ====================================================================================================================
// Setting up Sessions
auth.setup(app);

// ====================================================================================================================
// Setting up HTTP Controllers
app.use(require('./controllers'));

// ====================================================================================================================
// Setting up Websocket

io = io.listen(app.listen(config.port, function() {
    logger.info('Portfolio Items ' + packageJson.version +
                ' running in ' + config.env + ' mode, listening on port ' + config.port + '.');
}));

//console.log('cookie name', CookieName, 'secret', config.session.secret, 'store', auth.sessionStore);
io.use(passportSocketIo.authorize({
    key: CookieName,
    secret: config.session.secret, // the session_secret to parse the cookie
    store: auth.sessionStore,

    success: function(data, accept) {
        logger.debug('Successful connection to socket.io', data);
        accept();
    },
    fail: function(data, message, error, accept) {
        logger.error('Failed connection to socket.io:', message);
        if (error) {
            accept(new Error(message));
            // this error will be sent to the user as a special error-package
            // see: http://socket.io/docs/client-api/#socket > error-object
        }
    }
}));

websocket(io);
