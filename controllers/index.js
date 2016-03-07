'use strict';

//var fs = require('fs');
var express = require('express');
var config = require('../config/config');
var router = express.Router(); // eslint-disable-line new-cap
//var Note = require('../models/Note');

var passport = require('passport');

//router.use('/api', require('./api'));

router.get('/', require('connect-ensure-login').ensureLoggedIn(), function(req, res) {
    //console.log('/controllers/index.js');
    //console.log('USER', req.user);
    res.render('index', {title: config.appTitle, loginInfo: null});
});

router.get('/healthcheck', function(req, res) {
    res.json({'ok':true});
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/login/google', passport.authenticate('google', {scope: ['profile']}));

router.get('/login/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
        res.redirect('/');
    }
);

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
