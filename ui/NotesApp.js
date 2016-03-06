'use strict';

var React = require('react');
var Jumbotron = require('react-bootstrap').Jumbotron; // eslint-disable-line no-unused-vars
var Input = require('react-bootstrap').Input; // eslint-disable-line no-unused-vars
var Button = require('react-bootstrap').Button; // eslint-disable-line no-unused-vars
var Toolbar = require('./Toolbar'); // eslint-disable-line no-unused-vars
var Colors = require('./Colors');
//var cf = require('aws-cloudfront-sign');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            error: null,
            creating: false,
            notes: [],
            editing: []
        };
    },

    setupWebsocket: function() {
        this.socket = io(); // eslint-disable-line block-scoped-var, no-undef

        this.socket.on('appError', function(error) {
            console.log('appError', error);
            this.setState({error: error});
        }.bind(this));

        this.socket.on('allNotes', function(data) {
            console.log('allNotes', data);
            this.setState({notes: data});
        }.bind(this));

        this.socket.on('noteCreated', function(note) {
            this.state.notes.unshift(note);
            this.setState({notes: this.state.notes, creating: false});
        }.bind(this));

        this.socket.on('noteUpdated', function(note) {
            this.restoreNote(note);
            //this.state.notes.unshift(note);
            //this.setState({notes: this.state.notes, creating: false});
        }.bind(this));

        this.socket.on('noteDeleted', function(noteId) {
            this.state.editing.splice(this.state.editing.indexOf(noteId), 1);
            this.setState({editing: this.state.editing});
            var notes = [];
            for (var i = 0; i < this.state.notes.length; ++i) {
                if (this.state.notes[i].id !== noteId) {
                    notes.push(this.state.notes[i]);
                }
            }
            this.setState({notes: notes});
        }.bind(this));

    },

    componentWillMount: function() {
        console.log('componentWillMount');
        this.setupWebsocket();
        this.socket.emit('getAllNotes');
    },

    componentDidMount: function() {
        console.log('componentDidMount');
    },

    /*
    signOut: function() {
        window.google.identitytoolkit.signOut();
    },
    */

    newNote: function() {
        this.setState({creating: true});
    },

    createNote: function(e) {
        e.preventDefault();
        this.socket.emit('createNote', {
            color: Colors.getRandomColor(),
            content: this.refs.content.getDOMNode().value,
        });
    },

    cancelCreate: function() {
        this.setState({creating: false});
    },

    editNote: function(note) {
        this.state.editing.push(note.id);
        this.setState({editing: this.state.editing});
    },

    restoreNote: function(note) {
        this.state.editing.splice(this.state.editing.indexOf(note.id), 1);
        this.setState({editing: this.state.editing});
    },

    cancelEdit: function(note) {
        this.restoreNote(note);
    },

    updateNote: function(note) {
        note.content = this.refs['content-' + note.id].getDOMNode().value;
        this.socket.emit('updateNote', note);
    },

    deleteNote: function(note) {
        //TODO confirm
        this.socket.emit('deleteNote', note.id);
    },

    render: function() {
        var createDiv;
        var errorDiv;
        if (this.state.creating) {
            createDiv = (<div className='note note-new'>
                <textarea ref='content'/><br/>
            </div>);
        }
        if (this.state.error) {
            errorDiv = (<div className='app-error' id='app-error'>
                <pre>
                    <code>
                        {JSON.stringify(this.state.error, null, 2)}
                    </code>
                </pre>
            </div>);
        }
        return (
            <div>
                {errorDiv}
                <Toolbar newNote={this.newNote} createNote={this.createNote}
                         cancelCreate={this.cancelCreate} isCreating={this.state.creating}/>
                {createDiv}
                <div id='notes'>
                {this.state.notes.map(function(note) {
                    if (this.state.editing.indexOf(note.id) > -1) {
                        return (<div key={note.id} className={'note-edit note-' + note.color}>
                            <textarea ref={'content-' + note.id} defaultValue={note.content}/><br/>
                            <button onClick={this.updateNote.bind(null, note)}>Save</button>
                            <button onClick={this.cancelEdit.bind(null, note)}>Cancel</button>
                            <button onClick={this.deleteNote.bind(null, note)}>Delete</button>
                        </div>);
                    }
                    return (<div key={note.id} className={'note note-' + note.color}>
                        <textarea value={note.content} readOnly={true}
                            onDoubleClick={this.editNote.bind(null, note)}/>
                    </div>);
                }.bind(this))}
                </div>
            </div>
        );
    }
});
