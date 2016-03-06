var AWS = require('aws-sdk');

module.exports = {
    validUserIds: [
        '01294641996338404277', // eric.sperano@gmail.com
        '02310482117186701226'  // eric.sperano2@gmail.com
    ],
    authentication: {
        google: {
            prod: {
                callbackURL: 'https://notes.spe.quebec/login/google/callback'
            },
            dev: {
                callbackURL: 'http://localhost:3000/login/google/callback'
            }
        }
    }
};

if (process.env.NOTES_SERVER_ENV && process.env.NOTES_SERVER_ENV === 'dev') {
    module.exports.env = 'dev';
    console.log('Running in development mode.');
    module.exports.authentication.google.callbackURL = module.exports.authentication.google.dev.callbackURL;
} else {
    module.exports.env = 'prod';
    console.log('Running in production mode.');
    module.exports.authentication.google.callbackURL = module.exports.authentication.google.prod.callbackURL;
}

AWS.config.update({
    region: 'us-west-2' // TODO????
});
