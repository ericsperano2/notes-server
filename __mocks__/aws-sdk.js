'use strict';

var User1 = 'eric';

var DefaultDataUser1 = [
    {
        userid: User1,
        timestamp: Date.now(),
        content: 'Hello World',
        color: 'yellow'
    }
];

var SampleError = {
    message: 'Requested resource not found',
    code: 'ResourceNotFoundException',
    time: '2016-03-09T20:59:39.638Z',
    requestId: 'HACABVMJGHN8BUINGHUVGIMH57VV4KQNSO5AEMVJF66Q9ASUAAJG',
    statusCode: 400,
    retryable: false,
    retryDelay: 0
};

//jest.autoMockOff();
//module.exports = require.requireActual('aws-sdk');
module.exports = {
    DynamoDB: {
        User1: User1,
        DataUser1: DefaultDataUser1,
        SampleError: SampleError,
        DocumentClient: function() {
            this.query = function(params, callback) {
                if (params.ExpressionAttributeValues[':userid'] === 'any_error_id') {
                    return callback(SampleError);
                }
                if (params.ExpressionAttributeValues[':userid'] === User1) {
                    return callback(null, {Items: DefaultDataUser1});
                }
                return callback(null, {Items: []});
            };

        }
    }
};
//jest.autoMockOn();
