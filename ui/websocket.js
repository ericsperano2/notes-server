'use strict';

var socket = io(); // eslint-disable-line block-scoped-var, no-undef
var ErrorActions = require('./ErrorActions');
var NotesActions = require('./NotesActions');
var UserActions = require('./UserActions');

socket.on('connect', function() {
    console.log('websocket.connect');
    ErrorActions.reset();
});

socket.on('connect_error', function(error) {
    error = {
        msg: 'websocket.connect_error',
        description: 'Check your console log for more details.',
        error: error
    };
    console.log('websocket.connect_error', error);
    ErrorActions.error(error);
});

socket.on('appError', function(error) {
    console.log('appError', error);
    ErrorActions.error(error);
});

socket.on('authenticated', function(user) {
    UserActions.authenticated(user);
});

socket.on('allNotes', function(data) {
    console.log('allNotes', data);
    NotesActions.reset(data);
});

socket.on('noteCreated', function(note) {
    console.log('noteCreated', note);
    NotesActions.created(note);
});

socket.on('noteUpdated', function(note) {
    console.log('noteUpdated', note);
    NotesActions.updated(note);
});

socket.on('noteDeleted', function(timestamp) {
    console.log('noteDeleted', timestamp);
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
