'use strict';

var AWS = require('aws-sdk');
var _ = require('lodash');
var config = require('../config');
var logger = require('../logger');
var docClient = new AWS.DynamoDB.DocumentClient();

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

        docClient.query(params, function(err, data) {
            if (err) {
                logger.error('getAll', userid, 'Unable to query:\n' + JSON.stringify(err, null, 2));
                return callback(err);
            }
            logger.debug('getAll for', userid, ': ' + String(data.Items.length) + ' item(s) found.');
            callback(null, data.Items.reverse());
        });
    },

    // ================================================================================================================
    create: function(note, callback) {
        if (_.isUndefined(userid)) {
            return callback(appError('invalid_note', "Note can't be undefined."));
        }
        if (_.isNull(userid)) {
            return callback(appError('invalid_note', "Note can't be null."));
        }
        logger.debug('Creating note for', note.userid);
        if (_.isUndefined(note.userid)) {
            return callback(appError('invalid_userid', "Note.userid can't be undefined."));
        }
        if (_.isNull(note.userid)) {
            return callback(appError('invalid_userid', "Note.userid can't be null."));
        }
        //note.timestamp = Date.now(); // TODO UTC
        var params = {
            TableName: config.tables.notes,
            Item: note
        };
        docClient.put(params, function(err) {
            if (err) {
                logger.error('Unable to add item:', err);
                callback(err);
            } else {
                logger.debug('Added item:', note);
                callback(null, note);
            }
        });
    },

    // ================================================================================================================
    update: function(note, callback) {
        logger.debug('Updating note for', note.userid, note.timestamp);
        var params = {
            TableName: config.tables.notes,
            Item: note
        };
        docClient.put(params, function(err) {
            if (err) {
                logger.error('Unable to update item:', err);
                return callback(err);
            }
            logger.debug('Updated item:', note);
            callback(null, note);
        });
    },

    // ================================================================================================================
    delete: function(userid, timestamp, callback) {
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
                logger.error('Unable to delete item:', err);
                return callback(err);
            }
            logger.debug('DeleteItem succeeded:', data);
            callback(null, data);
        });
    }
};
