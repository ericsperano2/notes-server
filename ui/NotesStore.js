'use strict';

var Reflux = require('reflux');
var Colors = require('../models/Colors');
var NotesActions = require('./NotesActions');
var websocket = require('./websocket');
var _ = require('lodash');


module.exports = Reflux.createStore({
    listenables: [NotesActions],

    onNew: function() {
        var note = {
            color: Colors.getRandomColor(),
            content: '',
            mode: 'creating',
            timestamp: Date.now() // TODO UTC, set one server side if none
        };
        this.notes.unshift(note);
        this.trigger(this.notes);
    },

    onCreate: function(note) {
        websocket.createNote({
            timestamp: note.timestamp,
            color: note.color,
            content: note.content
        });
    },

    onCreated: function(note) {
        note.mode = 'read';
        var index = _.indexOf(this.notes, _.find(this.notes, {timestamp: note.timestamp}));
        this.notes.splice(index, 1, note);
        this.trigger(this.notes);
    },

    onReset: function(notes) {
        this.notes = notes;
        this.notes.forEach(function(note) {
            note.mode = 'read';
        });
        this.trigger(notes);
    },

    onCancelCreate: function(note) {
        this.onDeleted(note.timestamp);
    },

    onCancelEdit: function(note) {
        note.mode = 'read';
        this.trigger(this.notes);
    },

    onEdit: function(note) {
        note.mode = 'editing';
        this.trigger(this.notes);
    },

    onUpdate: function(note) {
        websocket.updateNote({
            timestamp: note.timestamp,
            color: note.color,
            content: note.content
        });
    },

    onUpdated: function(note) {
        note.mode = 'read';
        var index = _.indexOf(this.notes, _.find(this.notes, {timestamp: note.timestamp}));
        this.notes.splice(index, 1, note);
        this.trigger(this.notes);
    },

    onDelete: function(note) {
        websocket.deleteNote(note.timestamp);
    },

    onDeleted: function(timestamp) {
        var index = _.indexOf(this.notes, _.find(this.notes, {timestamp: timestamp}));
        this.notes.splice(index, 1);
        this.trigger(this.notes);
    }

});
