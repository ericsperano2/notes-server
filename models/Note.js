'use strict';

var AWS = require('aws-sdk');

var config = require('../config');
var logger = require('../logger');
var docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
    getAll: function(userid, callback) {
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
                logger.error('getAll', userid, 'Unable to query:\n' + JSON.stringify(err, null, 2));
                return callback(err);
            }
            logger.debug('getAll for', userid, ': ' + String(data.Items.length) + ' item(s) found.');
            callback(null, data.Items.reverse());
        });
    },

    create: function(note, callback) {
        logger.debug('Creating note for', note.userid);
        if (!note.userid) {
            return callback('must set userid');
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
