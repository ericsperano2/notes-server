'use strict';

var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/', ensureLoggedIn('/auth/login'), function(req, res) {
    res.render('index');
});

router.get('/healthcheck', function(req, res) {
    res.json({'ok':true});
});

router.use('/auth', require('./auth'));

//router.use('/api', require('./api'));

module.exports = router;
