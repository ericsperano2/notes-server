'use strict';

var Colors = ['red', 'green', 'blue', 'yellow'];

module.exports = {
    Colors: Colors,

    getRandomColor: function() {
        return Colors[Math.floor(Math.random() * Colors.length)];
    }
};
