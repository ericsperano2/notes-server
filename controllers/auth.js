'use strict';

var express = require('express');
var router = express.Router(); // eslint-disable-line new-cap
var passport = require('passport');
var logger = require('../logger');

router.get('/login', function(req, res) {
    res.render('auth/login');
});

router.get('/login/google', passport.authenticate('google', {scope: ['profile']}));

router.get('/login/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
        logger.debug('google authenticate callback', req.user);
        res.redirect('/');
    }
);

router.get('/logout', function(req, res) {
    logger.debug('logout', req.user);
    req.logout();
    res.redirect('/');
});

module.exports = router;
