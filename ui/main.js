'use strict';

var React = require('react'); // eslint-disable-line no-unused-vars
var render = require('react-dom').render;
//var ReactRouter = require('react-router'); // eslint-disable-line no-unused-vars
var Route = require('react-router').Route; // eslint-disable-line no-unused-vars
var Router = require('react-router').Router; // eslint-disable-line no-unused-vars
var hashHistory = require('react-router').hashHistory;
var NotesApp = require('./NotesApp'); // eslint-disable-line no-unused-vars
var NotesLogin = require('./NotesLogin'); // eslint-disable-line no-unused-vars

(function() {
    /*
    var routes = (
        //<ReactRouter.Route name="Completed" path="/completed" handler={TodoMain} />
        //<ReactRouter.Route name="Active" path="/active" handler={TodoMain} />
        <Route handler={NotesApp}>
            <Route name="default" path="/" handler={NotesMain} />
        </Route>
        <Route path="/" component={NotesApp}>

        </Route>
    );*/
    render((
        <Router history={hashHistory}>
            <Route path="/" component={NotesApp}>
            </Route>
        </Router>
    ), document.getElementById('root-panel'));
})();
