'use strict';

var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();
var _ = require('lodash');
var StatsD = require('node-statsd');
var config = require('../config');
var logger = require('../logger');
var Colors = require('./Colors');
var statsd = new StatsD.StatsD(config.statsd); // eslint-disable-line new-cap

var appError = function(error, message) {
    return {appError: true, error: error, message: message};
};

var validateUndefinedOrNull = function(x, typeValidator, funcName, varName, type, callback) {
    if (_.isUndefined(x)) {
        statsd.increment('Note.' + funcName + '.error.undefined_' + varName);
        callback(appError('undefined_' + varName, varName + " can't be undefined."));
    } else if (_.isNull(x)) {
        statsd.increment('Note.' + funcName + '.error.null_' + varName);
        callback(appError('null_' + varName, varName + " can't be null."));
    } else if (!typeValidator(x)) {
        statsd.increment('Note.' + funcName + '.error.not_a_' + type + '_' + varName);
        callback(appError('not_a_' + type + '_' + varName, varName + ' has to be a ' + type + '.'));
    } else {
        return true;
    }
    return false;
};

// ====================================================================================================================
var validateGetAll = function(userid, callback) {
    return validateUndefinedOrNull(userid, _.isString, 'getAll', 'userid', 'string', callback);
};

module.exports.getAll = function(userid, callback) {
    statsd.increment('Note.getAll.attempt');
    if (!validateGetAll(userid, callback)) {
        return false;
    }
    logger.debug('Note.getAll for', userid);
    var params = {
        TableName : config.tables.notes,
        KeyConditionExpression: 'userid = :userid',
        ExpressionAttributeValues: {
            ':userid': userid
        }
    };
    docClient.query(params, function(err, data) {
        if (err) {
            statsd.increment('Note.getAll.error');
            logger.error('getAll', userid, 'Unable to query:\n' + JSON.stringify(err, null, 2));
            return callback(err);
        }
        statsd.increment('Note.getAll.success');
        logger.debug('getAll for', userid, ': ' + String(data.Items.length) + ' item(s) found.');
        callback(null, data.Items.reverse());
    });
};

// ====================================================================================================================
var validateCreate = function(note, callback) {
    if (validateUndefinedOrNull(note, _.isObject, 'create', 'note', 'object', callback) &&
        validateUndefinedOrNull(note.userid, _.isString, 'create', 'userid', 'string', callback) &&
        validateUndefinedOrNull(note.content, _.isString, 'create', 'content', 'string', callback)) {

        if (note.color && Colors.Colors.indexOf(note.color) === -1) {
            statsd.increment('Note.create.error.invalid_color');
            callback(appError('invalid_color', 'Invalid note.color: "' + note.color + '".'));
            return false;
        }
        return true;
    }
    return false;
};

module.exports.create = function(note, callback) {
    statsd.increment('Note.create.attempt');
    if (!validateCreate(note, callback)) {
        return false;
    }
    logger.debug('Creating note for', note.userid);

    // set a timestamp if none
    if (_.isUndefined(note.timestamp) || _.isNull(note.timestamp)) {
        statsd.increment('Note.create.without_timestamp');
        note.timestamp = Date.now(); // TODO UTC
    } else {
        statsd.increment('Note.create.with_timestamp');
    }
    // set a color if none
    if (_.isUndefined(note.color) || _.isNull(note.color)) {
        statsd.increment('Note.create.without_color');
        note.color = Colors.getRandomColor();
    } else {
        statsd.increment('Note.create.with_color');
    }
    var params = {
        TableName: config.tables.notes,
        Item: note
    };
    docClient.put(params, function(err) {
        if (err) {
            statsd.increment('Note.create.error.other');
            logger.error('Unable to add item:', err);
            return callback(err);
        }
        statsd.increment('Note.create.success');
        logger.debug('Added item:', note);
        callback(null, note);
    });
};

// ====================================================================================================================
var validateUpdate = function(note, callback) {
    //return validateUndefinedOrNull(userid, _.isString, 'getAll', 'userid', 'string', callback);
    if (validateUndefinedOrNull(note, _.isObject, 'update', 'note', 'object', callback) &&
        validateUndefinedOrNull(note.userid, _.isString, 'update', 'userid', 'string', callback) &&
        validateUndefinedOrNull(note.timestamp, _.isNumber, 'update', 'timestamp', 'number', callback) &&
        validateUndefinedOrNull(note.content, _.isString, 'update', 'content', 'string', callback)) {

        if (note.color && Colors.Colors.indexOf(note.color) === -1) {
            statsd.increment('Note.update.error.invalid_color');
            callback(appError('invalid_color', 'Invalid note.color: "' + note.color + '".'));
            return false;
        }
        return true;
    }
    return false;
};

module.exports.update = function(note, callback) {
    statsd.increment('Note.update.attempt');
    if (!validateUpdate(note, callback)) {
        return false;
    }
    logger.debug('Updating note for', note.userid, note.timestamp);
    var params = {
        TableName: config.tables.notes,
        Item: note
    };
    // set a color if none
    if (_.isUndefined(note.color) || _.isNull(note.color)) {
        statsd.increment('Note.update.without_color');
        note.color = Colors.getRandomColor();
    } else {
        statsd.increment('Note.update.with_color');
    }
    docClient.put(params, function(err) {
        if (err) {
            statsd.increment('Note.update.error.other');
            logger.error('Unable to update item:', err);
            return callback(err);
        }
        statsd.increment('Note.update.success');
        logger.debug('Updated item:', note);
        callback(null, note);
    });
};

// ====================================================================================================================
var validateDelete = function(userid, timestamp, callback) {
    return validateUndefinedOrNull(userid, _.isString, 'delete', 'userid', 'string', callback) &&
            validateUndefinedOrNull(timestamp, _.isNumber, 'delete', 'timestamp', 'number', callback);
};

module.exports.delete = function(userid, timestamp, callback) {
    statsd.increment('Note.delete.attempt');
    if (!validateDelete(userid, timestamp, callback)) {
        return false;
    }
    logger.debug('Deleting note for', userid, timestamp);
    var params = {
        TableName: config.tables.notes,
        Key: {
            userid: userid,
            timestamp: timestamp
        },
    };
    docClient.delete(params, function(err) {
        if (err) {
            statsd.increment('Note.delete.error.other');
            logger.error('Unable to delete item:', err);
            return callback(err);
        }
        statsd.increment('Note.delete.success');
        logger.debug('DeleteItem succeeded:', userid, timestamp);
        callback(null, userid, timestamp);
    });
};
