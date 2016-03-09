'use strict';

var React = require('react');
var Input = require('react-bootstrap').Input; // eslint-disable-line no-unused-vars
var Button = require('react-bootstrap').Button; // eslint-disable-line no-unused-vars
var Toolbar = require('./Toolbar'); // eslint-disable-line no-unused-vars
var NotesActions = require('./NotesActions');

module.exports = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    cancelCreate: function() {
        NotesActions.cancelCreate(this.props.note);
    },

    create: function() {
        this.props.note.content = this.refs.content.value;
        NotesActions.create(this.props.note);
    },

    delete: function() {
        NotesActions.delete(this.props.note);
    },

    edit: function() {
        NotesActions.edit(this.props.note);
    },

    cancelEdit: function() {
        NotesActions.cancelEdit(this.props.note);
    },

    update: function() {
        this.props.note.content = this.refs.content.value;
        NotesActions.update(this.props.note);
    },

    render: function() {
        if (this.props.note.mode === 'editing') {
            return (<div className={'note-edit note-' + this.props.note.color}>
                <textarea ref='content' defaultValue={this.props.note.content}/><br/>
                <Button onClick={this.update}>Save</Button>
                <Button onClick={this.cancelEdit}>Cancel</Button>
                <Button onClick={this.delete}>Delete</Button>
            </div>);
        }
        if (this.props.note.mode === 'creating') {
            return (<div className={'note-edit note-' + this.props.note.color}>
                <textarea ref='content' defaultValue={this.props.note.content}/><br/>
                <Button onClick={this.create}>Add</Button>
                <Button onClick={this.cancelCreate}>Cancel</Button>
            </div>);
        }
        return (<div key={this.props.note.timestamp} className={'note note-' + this.props.note.color}>
            <textarea value={this.props.note.content} readOnly={true} onDoubleClick={this.edit} />
        </div>);
    }
});
