'use strict';

var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap
var passport = require('passport');
var logger = require('../logger');
var config = require('../config');
var StatsD = require('node-statsd');
var statsd = new StatsD.StatsD(config.statsd); // eslint-disable-line new-cap

router.get('/login', function(req, res) {
    statsd.increment('auth.login.attempt');
    res.render('auth/login');
});

router.get('/login/google', passport.authenticate('google', {scope: ['profile']}));

router.get('/login/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
        statsd.increment('auth.google.login.success');
        logger.debug('google authenticate callback', req.user);
        res.redirect('/');
    }
);

router.get('/logout', function(req, res) {
    logger.debug('logout', req.user);
    statsd.increment('auth.logout');
    req.logout();
    res.redirect('/');
});

module.exports = router;
