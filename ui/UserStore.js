'use strict';

var Reflux = require('reflux');
var UserActions = require('./UserActions');

module.exports = Reflux.createStore({
    listenables: [UserActions],

    onAuthenticated: function(user) {
        this.user = user;
        this.trigger(user);
    }
});
