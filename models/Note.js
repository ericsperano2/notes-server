'use strict';

var AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-west-2',
    //endpoint: "http://localhost:8000"
});
var db = new AWS.DynamoDB();

var Notes = [
    {
        id: 1,
        color: 'red',
        content: 'Bla bla bla bla bla bla bla bla bla\nbla bla bla bla bla bla \nbla bla bla bla bla bla 1'
    },
    {
        id: 2,
        color: 'green',
        content: 'Bla bla bla bla bla bla bla bla bla\nbla bla bla bla bla bla \nbla bla bla bla bla bla 2'
    },
    {
        id: 3,
        color: 'blue',
        content: 'Bla bla bla bla bla bla bla bla bla\nbla bla bla bla bla bla \nbla bla bla bla bla bla 3'
    },
    {
        id: 4,
        color: 'yellow',
        content: 'Bla bla bla bla bla bla bla bla bla\nbla bla bla bla bla bla \nbla bla bla bla bla bla 4'
    },
    {
        id: 5,
        color: 'red',
        content: 'Bla bla bla bla bla bla bla bla bla\nbla bla bla bla bla bla \nbla bla bla bla bla bla 5'
    },
    {
        id: 6,
        color: 'green',
        content: 'Bla bla bla bla bla bla bla bla bla\nbla bla bla bla bla bla \nbla bla bla bla bla bla 6'
    },
    {
        id: 7,
        color: 'blue',
        content: 'Bla bla bla bla bla bla bla bla bla\nbla bla bla bla bla bla \nbla bla bla bla bla bla 7'
    },
    {
        id: 8,
        color: 'yellow',
        content: 'Bla bla bla bla bla bla bla bla bla\nbla bla bla bla bla bla \nbla bla bla bla bla bla 8'
    },
    {
        id: 9,
        color: 'red',
        content: 'Bla bla bla bla bla bla bla bla bla\nbla bla bla bla bla bla \nbla bla bla bla bla bla 9'
    },
    {
        id: 10,
        color: 'green',
        content: 'Bla bla bla bla bla bla bla bla bla\nbla bla bla bla bla bla \nbla bla bla bla bla bla 10'
    },
    {
        id: 11,
        color: 'blue',
        content: 'Bla bla bla bla bla bla bla bla bla\nbla bla bla bla bla bla \nbla bla bla bla bla bla 11'
    },
    {
        id: 12,
        color: 'yellow',
        content: 'Bla bla bla bla bla bla bla bla bla\nbla bla bla bla bla bla \nbla bla bla bla bla bla 12'
    },



];

module.exports = {

    getAll: function(callback) {
        console.log('YOYOYOYOYO');
        db.listTables(function(err, data) {
            console.log(data.TableNames);
            callback(null, Notes.slice(0).reverse());
        });
    },

    create: function(note) {
        note.id = Notes[Notes.length - 1].id + 1;
        Notes.push(note);
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
