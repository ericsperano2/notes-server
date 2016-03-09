'use strict';

var React = require('react');
var ReactRouter = require('react-router'); // eslint-disable-line no-unused-vars
var Reflux = require('reflux');

var websocket = require('./websocket');
var ErrorStore = require('./ErrorStore');
var NotesStore = require('./NotesStore');
var UserStore = require('./UserStore');
var ErrorPanel = require('./ErrorPanel'); // eslint-disable-line no-unused-vars
var Toolbar = require('./Toolbar'); // eslint-disable-line no-unused-vars
var Note = require('./Note'); // eslint-disable-line no-unused-vars

// Renders the full application
module.exports = React.createClass({
    mixins: [Reflux.connect(ErrorStore, 'error'),
             Reflux.connect(NotesStore, 'notes'),
             Reflux.connect(UserStore, 'user')],

    getInitialState: function() {
        return {
            user: null,
            error: null,
            notes: []
        };
    },

    componentWillMount: function() {
        websocket.getAllNotes();
    },

    render: function() {
        // <ReactRouter.RouteHandler notes={this.state.notes} />
        return (
            <div>
                {this.state.error ? <ErrorPanel error={this.state.error}/> : null}
                <Toolbar user={this.state.user}/>
                <div id='notes'>
                {this.state.notes.map(function(note) {
                    return (<Note note={note} key={note.timestamp}/>);
                }.bind(this))}
                </div>

            </div>
        );
    },
});
