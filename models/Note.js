'use strict';

var config = require('../config/config');
var AWS = require('aws-sdk');

var docClient = new AWS.DynamoDB.DocumentClient();

module.exports = {

    getAll: function(callback) {
        console.log('Note.getAll');
        var params = {
            TableName : config.tables.notes//,
            /*
            KeyConditionExpression: "#yr = :yyyy",
            ExpressionAttributeNames:{
                "#yr": "year"
            },
            ExpressionAttributeValues: {
                ":yyyy":1985
            }
            */
        };

        docClient.scan(params, function(err, data) {
            if (err) {
                console.error('Notes.docClient.scan Unable to query:\n' + JSON.stringify(err, null, 2));
                return callback(err);
            }
            console.log('Notes.docClient.scan: ' + data.Items.length + ' item(s) found.');
            callback(null, data.Items);
        });
    },

    create: function(note) {
        note.uuid = '1';
        note.timestamp = String(Date.now());
        console.log(JSON.stringify(note, null, 2));
        var params = {
            TableName: config.tables.notes,
            Item: note
        };
        docClient.put(params, function(err, data) {
            if (err) {
                console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
            } else {
                console.log('Added item:', JSON.stringify(data, null, 2));
            }
        });
    },

    update: function(note) {
        /*
        for (var i = 0; i < Notes.length; ++i) {
            if (Notes[i].id === note.id) {
                Notes[i] = note;
                break;
            }
        }
        */
    },

    delete: function(noteId) {
        /*
        for (var i = 0; i < Notes.length; ++i) {
            if (Notes[i].id === noteId) {
                Notes.splice(i, 1);
                break;
            }
        }
        */
    }
};
