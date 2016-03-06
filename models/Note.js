'use strict';

var config = require('../config/config')
var AWS = require('aws-sdk');

if (config.env === 'dev') {
    var credentials = new AWS.SharedIniFileCredentials({profile: 'portfolio_demo'});
    AWS.config.credentials = credentials;
}
var docClient = new AWS.DynamoDB.DocumentClient();

/*
AWS.config.update({
    region: 'us-west-2',
    //endpoint: "http://localhost:8000"
});
*/
//var AWS = require('aws-sdk');

/*
*/
//var db = new AWS.DynamoDB();

var TblNotes = 'notes';

module.exports = {

    getAll: function(callback) {
        console.log('getAll');
        var params = {
            TableName : TblNotes//,
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
                console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
            } else {
                console.log('Scan succeeded.', data);
                callback(null, data.Items);
            }
        });
    },

    create: function(note) {
        note.uuid = '1';
        note.timestamp = "" + Date.now();
        console.log(JSON.stringify(note, null, 2));
        var params = {
            TableName: TblNotes,
            Item: note
        };
        docClient.put(params, function(err, data) {
            if (err) {
                console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
            } else {
                console.log('Added item:', JSON.stringify(data, null, 2));
            }
        });

        //note.id = Notes[Notes.length - 1].id + 1;
        //Notes.push(note);
    },

    update: function(note) {
        for (var i = 0; i < Notes.length; ++i) {
            if (Notes[i].id === note.id) {
                Notes[i] = note;
                break;
            }
        }
    },

    delete: function(noteId) {
        for (var i = 0; i < Notes.length; ++i) {
            if (Notes[i].id === noteId) {
                Notes.splice(i, 1);
                break;
            }
        }
    }
};
