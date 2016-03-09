'use strict';

var Reflux = require('reflux');
var ErrorActions = require('./ErrorActions');

module.exports = Reflux.createStore({
    listenables: [ErrorActions],

    onError: function(error) {
        console.log('ErrorStore.onError', error);
        this.error = error;
        this.trigger(error);
    },

    onReset: function() {
        console.log('ErrorStore.onReset');
        this.error = null;
        this.trigger(null);
    }

});
