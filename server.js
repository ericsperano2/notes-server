'use strict';

//var fs = require('fs');
var express = require('express');
var morgan = require('morgan');
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

// TODO share: middleware
//var GitkitClient = require('gitkitclient');
//var gitkitClient = new GitkitClient(JSON.parse(fs.readFileSync(config.gitkit.serverConfig)));

app.set('views', path.join(__dirname, 'views'));

app.engine('html', hbs({
    extname: '.html'
}));
app.set('view engine', 'html');

/*
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
*/

app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

app.use(require('./controllers'));

// widget page hosting Gitkit javascript
//app.get('/gitkit', renderGitkitWidgetPage);
//app.post('/gitkit', renderGitkitWidgetPage);

// Ajax endpoint to send email for password-recovery and email change event
/*
app.post('/sendemail', renderSendEmailPage);

function renderGitkitWidgetPage(req, res) {
    //res.writeHead(200, {'Content-Type': 'text/html'});
    //var html = new Buffer(fs.readFileSync('./views/gitkit-widget.html')).toString();
    //html = html.replace('%%postBody%%', encodeURIComponent(req.body || ''));
    //res.end(html);
    res.render('gitkit-widget', {widgetUrl: config.gitkit.widgetUrl, postBody: encodeURIComponent(req.body || '')});
}

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
