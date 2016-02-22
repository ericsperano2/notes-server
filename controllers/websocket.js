'use strict';

var Note = require('../models/Note');
/*
var OpsWorks = require('../models/OpsWorks');
var Instance = require('../models/Instance');

*/
module.exports = function(io) {
    io.on('connection', function(socket) {
        console.log('Websocket: client connected');

        // var currentTailConnection = null;

        socket.on('getAllNotes', function() {
            console.log('getAllNotes');
            Note.getAll(function(err, data) {
                socket.emit('allNotes', data);
            });
        });

        socket.on('createNote', function(note) {
            Note.create(note);
            socket.emit('noteCreated', note);
        });

        socket.on('updateNote', function(note) {
            Note.update(note);
            socket.emit('noteUpdated', note);
        });

        socket.on('deleteNote', function(noteId) {
            Note.delete(noteId);
            socket.emit('noteDeleted', noteId);
        });

        /*

        socket.on('getInstances', function(params) {
            console.log('getInstances', params);
            OpsWorks.getInstances(params.stackId, function(err, data) {
                if (err) {
                    //TODO
                    return;
                }
                console.log('emiting instances');
                socket.emit('instances', data);
            });
        });

        socket.on('getLogs', function(params) {
            console.log('getLogs', params);
            //Instance.getLogs('52.25.110.109', function(err, data) {
            Instance.getLogs(params.ipAddress, function(err, data) {
                if (err) {
                    //TODO
                    return;
                }
                console.log('emiting logs');
                socket.emit('logs', data);
            });
        });

        socket.on('startTail', function(params) {
            console.log('startTail', params);
            //Instance.tailLog('52.25.110.109', params.log, function(err, tail) {
            Instance.tailLog(params.ipAddress, params.log, function(err, tail) {
                if (err) {
                    //TODO
                    return;
                }
                if (currentTailConnection) {
                    console.log('Closing previous tail connection');
                    currentTailConnection.end();
                }
                currentTailConnection = tail.connection;
                tail.stream.on('data', function(data) {
                    console.log('emiting logData');
                    socket.emit('logData', String(data));
                });
            });
        });

        socket.on('close', function() {
            if (currentTailConnection) {
                console.log('Closing the current tail connection');
                currentTailConnection.end();
                currentTailConnection = null;
            }
        });
        */

    });

};
