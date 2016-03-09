'use strict';

var AWS = require('aws-sdk');
var _ = require('lodash');
var config = require('../config');
var logger = require('../logger');
var docClient = new AWS.DynamoDB.DocumentClient();
var StatsD = require('node-statsd');
var statsd = new StatsD.StatsD(config.statsd); // eslint-disable-line new-cap

var appError = function(error, message) {
    return {appError: true, error: error, message: message};
};

module.exports = {
    // ================================================================================================================
    getAll: function(userid, callback) {
        logger.debug('Note.getAll for', userid);
        if (_.isUndefined(userid)) {
            return callback(appError('invalid_userid', "Userid can't be undefined."));
        }
        if (_.isNull(userid)) {
            return callback(appError('invalid_userid', "Userid can't be null."));
        }
        var params = {
            TableName : config.tables.notes +'zz',
            KeyConditionExpression: 'userid = :userid',
            ExpressionAttributeValues: {
                ':userid': userid
            }
        };

        statsd.increment('Note.getAll.attempt');
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
    },

    // ================================================================================================================
    create: function(note, callback) {
        statsd.increment('Note.create.attempt');
        if (_.isUndefined(userid)) {
            statsd.increment('Note.create.error.undefined_note');
            return callback(appError('undefined_note', "Note can't be undefined."));
        }
        if (_.isNull(userid)) {
            statsd.increment('Note.create.error.null_note');
            return callback(appError('null_note', "Note can't be null."));
        }
        if (_.isUndefined(note.userid)) {
            statsd.increment('Note.create.error.undefined_userid');
            return callback(appError('undefined_userid', "Note.userid can't be undefined."));
        }
        if (_.isNull(note.userid)) {
            statsd.increment('Note.create.error.null_userid');
            return callback(appError('null_userid', "Note.userid can't be null."));
        }
        logger.debug('Creating note for', note.userid);

        // set a timestamp if none
        if (!note.timestamp) {
            note.timestamp = Date.now(); // TODO UTC
        }
        var params = {
            TableName: config.tables.notes,
            Item: note
        };
        docClient.put(params, function(err) {
            if (err) {
                statsd.increment('Note.create.error.other');
                logger.error('Unable to add item:', err);
                callback(err);
            } else {
                statsd.increment('Note.create.success');
                logger.debug('Added item:', note);
                callback(null, note);
            }
        });
    },

    // ================================================================================================================
    update: function(note, callback) {
        statsd.increment('Note.update.attempt');
        logger.debug('Updating note for', note.userid, note.timestamp);
        var params = {
            TableName: config.tables.notes,
            Item: note
        };
        docClient.put(params, function(err) {
            if (err) {
                statsd.increment('Note.update.error');
                logger.error('Unable to update item:', err);
                return callback(err);
            }
            statsd.increment('Note.update.success');
            logger.debug('Updated item:', note);
            callback(null, note);
        });
    },

    // ================================================================================================================
    delete: function(userid, timestamp, callback) {
        statsd.increment('Note.delete.attempt');
        logger.debug('Deleting note for', userid, timestamp);
        var params = {
            TableName: config.tables.notes,
            Key: {
                'userid': userid,
                timestamp: timestamp
            },
        };
        docClient.delete(params, function(err, data) {
            if (err) {
                statsd.increment('Note.delete.error');
                logger.error('Unable to delete item:', err);
                return callback(err);
            }
            statsd.increment('Note.delete.success');
            logger.debug('DeleteItem succeeded:', data);
            callback(null, data);
        });
    }
};
