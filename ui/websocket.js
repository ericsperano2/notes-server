'use strict';

module.exports = {

    setup: function(obj) {
        obj.socket = io(); // eslint-disable-line block-scoped-var, no-undef

        obj.socket.on('appError', function(error) {
            console.log('appError', error);
            obj.setState({error: error});
        });

        obj.socket.on('allNotes', function(data) {
            obj.setState({notes: data});
        });

        obj.socket.on('noteCreated', function(note) {
            obj.state.notes.unshift(note);
            obj.setState({notes: obj.state.notes, creating: false});
        });

        obj.socket.on('authenticated', function(user) {
            obj.setState({user: user});
        });

        obj.socket.on('noteUpdated', function(note) {
            //obj.restoreNote(note);
            //obj.state.notes.unshift(note);
            //obj.setState({notes: obj.state.notes, creating: false});
        });

        obj.socket.on('noteDeleted', function(timestamp) {
            obj.state.editing.splice(obj.state.editing.indexOf(timestamp), 1);
            obj.setState({editing: obj.state.editing});
            var notes = [];
            for (var i = 0; i < obj.state.notes.length; ++i) {
                if (obj.state.notes[i].timestamp !== timestamp) {
                    notes.push(obj.state.notes[i]);
                }
            }
            obj.setState({notes: notes});
        });
    },

};
