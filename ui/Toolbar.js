'use strict';

var React = require('react');
var Jumbotron = require('react-bootstrap').Jumbotron; // eslint-disable-line no-unused-vars
var Input = require('react-bootstrap').Input; // eslint-disable-line no-unused-vars
var Button = require('react-bootstrap').Button; // eslint-disable-line no-unused-vars

module.exports = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    render: function() {
        var btn;
        var name = null;

        if (this.props.user) {
            name = <span id='userDisplayName'>{this.props.user.displayName}</span>;
        }

        if (this.props.isCreating) {
            btn = [
                <Button onClick={this.props.createNote}>Save</Button>,
                <Button onClick={this.props.cancelCreate}>Cancel</Button>
            ];
        } else {
            btn = <Button onClick={this.props.newNote}>New Note</Button>;
        }
        return (
            <div id='main-toolbar' className='toolbar'>
                {name}
                {btn}
                <a href='/auth/logout'>Logout</a>
            </div>
        );
    }
});
