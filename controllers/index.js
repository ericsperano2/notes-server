'use strict';

var fs = require('fs');
var express = require('express');
var config = require('../config/config');
var router = express.Router(); // eslint-disable-line new-cap
var Note = require('../models/Note');

var passport = require('passport');

router.use('/api', require('./api'));
//router.use('/file', require('./file'));

//var GitkitClient = require('gitkitclient');
//var gitkitClient = new GitkitClient(JSON.parse(fs.readFileSync(config.gitkit.serverConfig)));

router.get('/',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res) {
        console.log('USER', req.user);
    /*
    if (req.cookies.gtoken) {
        gitkitClient.verifyGitkitToken(req.cookies.gtoken, function (err, resp) {
            if (err) {
                res.status(403).render('sorry', {title: config.appTitle});
            } else {
                if (config.gitkit.validUserIds.indexOf(resp.user_id) > -1) {
                    console.log('Valid user id!', resp.user_id);
                    res.render('index', {title: config.appTitle, loginInfo: resp});
                } else {
                    res.status(403).render('sorry', {title: config.appTitle});
                }
            }
        });
    } else {
    }
    */
    console.log('/controllers/index.js');
    res.render('index', {title: config.appTitle, loginInfo: null});
});

router.get('/healthcheck', function(req, res) {
    res.json({'ok':true});
});

router.get('/login',
    function(req, res) {
        res.render('login');
    }
);

router.get('/login/google',
  passport.authenticate('google', {scope: ['profile']}));

router.get('/login/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function(req, res) {
        res.redirect('/');
    }
);

module.exports = router;

/*

// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });




app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

*/
