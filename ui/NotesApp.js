'use strict';

var React = require('react');
var Jumbotron = require('react-bootstrap').Jumbotron; // eslint-disable-line no-unused-vars
var Input = require('react-bootstrap').Input; // eslint-disable-line no-unused-vars
var Button = require('react-bootstrap').Button; // eslint-disable-line no-unused-vars
var Toolbar = require('./Toolbar'); // eslint-disable-line no-unused-vars
var Colors = require('./Colors');
var websocket = require('./websocket');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            user: null,
            error: null,
            creating: false,
            notes: [],
            editing: []
        };
    },

    componentWillMount: function() {
        websocket.setup(this);
        this.socket.emit('getAllNotes');
    },

    componentDidMount: function() {
    },

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
        this.state.editing.push(note.timestamp);
        this.setState({editing: this.state.editing});
    },

    restoreNote: function(note) {
        this.state.editing.splice(this.state.editing.indexOf(note.timestamp), 1);
        this.setState({editing: this.state.editing});
    },

    cancelEdit: function(note) {
        this.restoreNote(note);
    },

    updateNote: function(note) {
        note.content = this.refs['content-' + note.timestamp].getDOMNode().value;
        this.socket.emit('updateNote', note);
    },

    deleteNote: function(note) {
        //TODO confirm
        this.socket.emit('deleteNote', note.timestamp);
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
        // TODO Note component
        return (
            <div>
                {errorDiv}
                <Toolbar user={this.state.user} newNote={this.newNote} createNote={this.createNote}
                         cancelCreate={this.cancelCreate} isCreating={this.state.creating}/>
                {createDiv}
                <div id='notes'>
                {this.state.notes.map(function(note) {
                    if (this.state.editing.indexOf(note.timestamp) > -1) {
                        return (<div key={note.timestamp} className={'note-edit note-' + note.color}>
                            <textarea ref={'content-' + note.timestamp} defaultValue={note.content}/><br/>
                            <button onClick={this.updateNote.bind(null, note)}>Save</button>
                            <button onClick={this.cancelEdit.bind(null, note)}>Cancel</button>
                            <button onClick={this.deleteNote.bind(null, note)}>Delete</button>
                        </div>);
                    }
                    return (<div key={note.timestamp} className={'note note-' + note.color}>
                        <textarea value={note.content} readOnly={true}
                            onDoubleClick={this.editNote.bind(null, note)}/>
                    </div>);
                }.bind(this))}
                </div>
            </div>
        );
    }
});
