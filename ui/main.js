'use strict';

var React = require('react'); // eslint-disable-line no-unused-vars
var render = require('react-dom').render;
var Route = require('react-router').Route; // eslint-disable-line no-unused-vars
var Router = require('react-router').Router; // eslint-disable-line no-unused-vars
var hashHistory = require('react-router').hashHistory;
var NotesApp = require('./NotesApp'); // eslint-disable-line no-unused-vars

(function() {
    render((
        <Router history={hashHistory}>
            <Route path="/" component={NotesApp}>
            </Route>
        </Router>
    ), document.getElementById('root-panel'));
})();
