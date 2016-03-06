var AWS = require('aws-sdk');

module.exports = {
    validUserIds: [
        '01294641996338404277', // eric.sperano@gmail.com
        '02310482117186701226'  // eric.sperano2@gmail.com
    ]
};

if (process.env.NOTES_SERVER_ENV && process.env.NOTES_SERVER_ENV === 'dev') {
    module.exports.env = 'dev';
    console.log('Running in development mode.');
    AWS.config.update({
        region: 'us-west-2'
    });
} else {
    module.exports.env = 'prod';
    console.log('Running in production mode.');
}
