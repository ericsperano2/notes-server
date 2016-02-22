'use strict';

var fs = require('fs');
var express = require('express');
var config = require('../config/config');
var router = express.Router(); // eslint-disable-line new-cap
var Note = require('../models/Note');

router.use('/api', require('./api'));
//router.use('/file', require('./file'));

//var GitkitClient = require('gitkitclient');
//var gitkitClient = new GitkitClient(JSON.parse(fs.readFileSync(config.gitkit.serverConfig)));

router.get('/', function(req, res) {
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
    res.render('index', {title: config.appTitle, loginInfo: null});
});


module.exports = router;
