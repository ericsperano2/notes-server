'use strict';

var React = require('react');
var Button = require('react-bootstrap').Button; // eslint-disable-line no-unused-vars
var NotesActions = require('./NotesActions');

module.exports = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    newNote: function() {
        NotesActions.new();
    },

    render: function() {
        var btn;
        var name = null;

        if (this.props.user) {
            name = <span id="user-display-name">{this.props.user.displayName}</span>;
        }

        btn = <Button id="new-note-btn" onClick={this.newNote}>New Note</Button>;
        return (
            <div id="main-toolbar" className="toolbar">
                {btn}
                <div className="right">
                    {name}
                    <Button id="logout-btn" href="/auth/logout">Logout</Button>
                </div>
            </div>
        );
    }
});
