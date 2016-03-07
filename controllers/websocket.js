'use strict';

var Note = require('../models/Note');

module.exports = function(io) {
    io.on('connection', function(socket) {
        //console.log('Websocket: client connected: ', socket.request.user);
        //console.log('logged_in?', socket.request.user.logged_in);

        socket.on('getAllNotes', function() {
            // TODO ensure logged_in
            Note.getAll(socket.request.user.id, function(err, data) {
                if (err) {
                    socket.emit('appError', err);
                    return;
                }
                socket.emit('allNotes', data);
            });
        });

        socket.on('createNote', function(note) {
            note.userid = socket.request.user.id;
            Note.create(note, function(err) {
                if (err) {
                    socket.emit('appError', err);
                    return;
                }
                socket.emit('noteCreated', note);
            });
        });

        socket.on('updateNote', function(note) {
            note.userid = socket.request.user.id;
            Note.update(note, function(err) {
                if (err) {
                    socket.emit('appError', err);
                    return;
                }
                socket.emit('noteUpdated', note);
            });
        });

        socket.on('deleteNote', function(timestamp) {
            Note.delete(socket.request.user.id, timestamp, function(err) {
                if (err) {
                    socket.emit('appError', err);
                    return;
                }
                socket.emit('noteDeleted', timestamp);
            });
        });

    });
};
