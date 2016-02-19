'use strict';

global.$ = require('jquery'); // for AJAX calls
var React = require('react');
var NotesApp = require('./NotesApp'); // eslint-disable-line no-unused-vars

$(function() {
    React.render(
        <NotesApp/>,
        document.getElementById('main-panel')
    );
});
