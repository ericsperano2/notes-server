'use strict';

var config = require('../config/config');
var AWS = require('aws-sdk');

var docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
    getAll: function(userid, callback) {
        console.log('Note.getAll', userid);
        var params = {
            TableName : config.tables.notes,
            KeyConditionExpression: 'userid = :userid',
            ExpressionAttributeValues: {
                ':userid': userid
            }
        };

        docClient.query(params, function(err, data) {
            if (err) {
                console.error('getAll', userid, 'Unable to query:\n' + JSON.stringify(err, null, 2));
                return callback(err);
            }
            console.log('getAll', userid, String(data.Items.length) + ' item(s) found.');
            callback(null, data.Items.reverse());
        });
    },

    create: function(note, callback) {
        if (!note.userid) {
            return callback('must set userid');
        }
        note.timestamp = Date.now(); // TODO UTC
        console.log(JSON.stringify(note, null, 2));
        var params = {
            TableName: config.tables.notes,
            Item: note
        };
        docClient.put(params, function(err) {
            if (err) {
                console.error('Unable to add item:', JSON.stringify(err, null, 2));
                callback(err);
            } else {
                console.log('Added item:', JSON.stringify(note, null, 2));
                callback(null, note);
            }
        });
    },

    update: function(note, callback) {
        var params = {
            TableName: config.tables.notes,
            Item: note
        };
        docClient.put(params, function(err) {
            if (err) {
                console.error('Unable to update item:', JSON.stringify(err, null, 2));
                return callback(err);
            }
            console.log('Updated item:', JSON.stringify(note, null, 2));
            callback(null, note);
        });
    },

    delete: function(userid, timestamp, callback) {
        var params = {
            TableName: config.tables.notes,
            Key: {
                'userid': userid,
                timestamp: timestamp
            },
        };
        docClient.delete(params, function(err, data) {
            if (err) {
                console.error('Unable to delete item:', JSON.stringify(err, null, 2));
                return callback(err);
            }
            console.log('DeleteItem succeeded:', JSON.stringify(data, null, 2));
            callback(null, data);
        });
    }
};
