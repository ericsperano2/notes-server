'use strict';

var React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return {
        };
    },

    render: function() {
        return (<div className='app-error' id='app-error'>
            <pre>
                <code>
                    {JSON.stringify(this.props.error, null, 2)}
                </code>
            </pre>
        </div>);
    }
});
