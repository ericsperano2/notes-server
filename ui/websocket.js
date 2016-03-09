'use strict';

var socket = io(); // eslint-disable-line block-scoped-var, no-undef
var ErrorActions = require('./ErrorActions');
var NotesActions = require('./NotesActions');
var UserActions = require('./UserActions');

socket.on('connect', function() {
    console.log('websocket.on.connect');
    ErrorActions.reset();
});

socket.on('connect_error', function(error) {
    error = {
        msg: 'websocket.on.connect_error',
        description: 'Check your console log for more details.',
        error: error
    };
    console.log('websocket.on.connect_error', error);
    ErrorActions.error(error);
});

socket.on('appError', function(error) {
    console.log('websocket.on.appError', error);
    ErrorActions.error(error);
});

socket.on('authenticated', function(user) {
    console.log('websocket.on.authenticated', user);
    UserActions.authenticated(user);
});

socket.on('allNotes', function(data) {
    console.log('websocket.on.allNotes', data);
    NotesActions.reset(data);
});

socket.on('noteCreated', function(note) {
    console.log('websocket.on.noteCreated', note);
    NotesActions.created(note);
});

socket.on('noteUpdated', function(note) {
    console.log('websocket.on.noteUpdated', note);
    NotesActions.updated(note);
});

socket.on('noteDeleted', function(timestamp) {
    console.log('websocket.on.noteDeleted', timestamp);
    NotesActions.deleted(timestamp);
});

module.exports = {

    getAllNotes: function() {
        socket.emit('getAllNotes');
    },

    createNote: function(note) {
        socket.emit('createNote', note);
    },

    updateNote: function(note) {
        socket.emit('updateNote', note);
    },

    deleteNote: function(timestamp) {
        socket.emit('deleteNote', timestamp);
    }


};
