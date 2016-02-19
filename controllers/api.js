'use strict';

//var fs = require('fs');
var express = require('express');
//var config = require('../config/config');
var router = express.Router(); // eslint-disable-line new-cap
var Note = require('../models/Note');

router.get('/', function(req, res) {
    res.json(Note.getAll());
});


module.exports = router;
