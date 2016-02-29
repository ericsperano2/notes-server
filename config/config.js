var AWS = require('aws-sdk');

module.exports = {
    gitkit: {
        validUserIds: [
            '01294641996338404277', // eric.sperano@gmail.com
            '02310482117186701226'  // eric.sperano2@gmail.com
        ],
        dev: {
            serverConfig: './config/gitkit-server-config-dev.json',
            widgetUrl: 'http://localhost:3000/gitkit'
        },
        prod: {
            serverConfig: './config/gitkit-server-config-prod.json',
            widgetUrl: 'http://notes.spe.quebec/gitkit'
        }
    }

};

if (process.env.NOTES_SERVER && process.env.NOTES_SERVER.indexOf('prod') > -1) {
    module.exports.env = 'prod';
    console.log('Running in production mode.');
    module.exports.gitkit.serverConfig = module.exports.gitkit.prod.serverConfig;
    module.exports.gitkit.widgetUrl = module.exports.gitkit.prod.widgetUrl;
} else {
    module.exports.env = 'dev';
    console.log('Running in development mode.');
    module.exports.gitkit.serverConfig = module.exports.gitkit.dev.serverConfig;
    module.exports.gitkit.widgetUrl = module.exports.gitkit.dev.widgetUrl;
    AWS.config.update({
        region: 'us-west-2'//,
        //endpoint: "http://localhost:8000"
    });
}
