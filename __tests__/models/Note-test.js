'use strict';

jest.dontMock('../../models/Note');
jest.dontMock('../../models/Colors');

// TODO mock statsd!
describe('models', function() {
    describe('Note', function() {
        // ============================================================================================================
        describe('getAll', function() {
            it('returns an error if userid is undefined', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.getAll(undefined, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'undefined_userid',
                    message: "userid can't be undefined."
                });
            });

            it('returns an error if userid is null', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.getAll(null, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'null_userid',
                    message: "userid can't be null."
                });
            });

            it('returns any other error', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.getAll('any_error_id', callback);
                expect(callback).toBeCalledWith(AWS.DynamoDB.SampleError);
            });

            it('returns an empty array if userid is not found', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.getAll('not_found_id', callback);
                expect(callback).toBeCalledWith(null, []);
            });

            it('returns data for user1', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.getAll(AWS.DynamoDB.User1, callback);
                expect(callback).toBeCalledWith(null, AWS.DynamoDB.DataUser1);
            });

        });

        // ============================================================================================================
        describe('create', function() {
            it('returns an error if note is undefined', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.create(undefined, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'undefined_note',
                    message: "note can't be undefined."
                });
            });

            it('returns an error if note is null', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.create(null, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'null_note',
                    message: "note can't be null."
                });
            });

            it('returns an error if note.userid is undefined', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.create({content: 'allo'}, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'undefined_userid',
                    message: "userid can't be undefined."
                });
            });

            it('returns an error if note.userid is null', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.create({userid: null, content: 'allo'}, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'null_userid',
                    message: "userid can't be null."
                });
            });

            it('returns an error if note.content is undefined', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.create({userid: AWS.DynamoDB.User1}, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'undefined_content',
                    message: "content can't be undefined."
                });
            });

            it('returns an error if note.content is null', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.create({userid: AWS.DynamoDB.User1, content: null}, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'null_content',
                    message: "content can't be null."
                });
            });

            it('returns an error if note.color is invalid', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.create({userid: AWS.DynamoDB.User1, content: 'allo', color: 'foo'}, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'invalid_color',
                    message: 'Invalid note.color: "foo".'
                });
            });

            it('returns any other error', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.create({userid:'any_error_id', content: 'error'}, callback);
                expect(callback).toBeCalledWith(AWS.DynamoDB.SampleError);
            });

            it('works, with all field already set', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                var note = {
                    userid: AWS.DynamoDB.User1,
                    timestamp: Date.now(),
                    content: 'allo',
                    color: 'red'
                };
                Note.create(note, callback);
                expect(callback).toBeCalledWith(null, note);
            });

            it('works, with timestamp not set', function() {
                var before = Date.now();
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                var note = {
                    userid: AWS.DynamoDB.User1,
                    content: 'allo',
                    color: 'red'
                };
                Note.create(note, callback);
                var after = Date.now();
                expect(callback).toBeCalled(); //With(null, note);
                expect(callback.mock.calls[0][0]).toBeNull();
                expect(callback.mock.calls[0][1]).toBeDefined();
                expect(callback.mock.calls[0][1].userid).toBe(AWS.DynamoDB.User1);
                expect(callback.mock.calls[0][1].content).toBe('allo');
                expect(callback.mock.calls[0][1].color).toBe('red');
                expect(callback.mock.calls[0][1].timestamp >= before).toBe(true);
                expect(callback.mock.calls[0][1].timestamp <= after).toBe(true);
            });

            it('works, with color not set', function() {
                var now = Date.now();
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                var note = {
                    userid: AWS.DynamoDB.User1,
                    content: 'allo',
                    timestamp: now,
                };
                Note.create(note, callback);
                var Colors = require('../../models/Colors');
                expect(callback).toBeCalled(); //With(null, note);
                expect(callback.mock.calls[0][0]).toBeNull();
                expect(callback.mock.calls[0][1]).toBeDefined();
                expect(callback.mock.calls[0][1].userid).toBe(AWS.DynamoDB.User1);
                expect(callback.mock.calls[0][1].content).toBe('allo');
                expect(callback.mock.calls[0][1].timestamp).toBe(now);
                expect(callback.mock.calls[0][1].color).toBeDefined();
                expect(Colors.Colors.indexOf(callback.mock.calls[0][1].color) > -1).toBe(true); // valid color name
            });

        });

        // ============================================================================================================
        describe('update', function() {
            it('returns an error if note is undefined', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.update(undefined, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'undefined_note',
                    message: "note can't be undefined."
                });
            });

            it('returns an error if note is null', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.update(null, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'null_note',
                    message: "note can't be null."
                });
            });

            it('returns an error if note.userid is undefined', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.update({content: 'allo', timestamp: Date.now()}, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'undefined_userid',
                    message: "userid can't be undefined."
                });
            });

            it('returns an error if note.userid is null', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.update({userid: null, content: 'allo', timestamp: Date.now()}, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'null_userid',
                    message: "userid can't be null."
                });
            });

            it('returns an error if note.timestamp is undefined', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.update({userid: AWS.DynamoDB.User1, content: 'allo'}, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'undefined_timestamp',
                    message: "timestamp can't be undefined."
                });
            });

            it('returns an error if note.timestamp is null', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.update({userid: AWS.DynamoDB.User1, content: 'allo', timestamp: null}, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'null_timestamp',
                    message: "timestamp can't be null."
                });
            });

            it('returns an error if note.content is undefined', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.update({userid: AWS.DynamoDB.User1, timestamp: Date.now()}, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'undefined_content',
                    message: "content can't be undefined."
                });
            });

            it('returns an error if note.content is null', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.update({userid: AWS.DynamoDB.User1, timestamp: Date.now(), content: null}, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'null_content',
                    message: "content can't be null."
                });
            });

            it('returns an error if note.color is invalid', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                var note = {userid: AWS.DynamoDB.User1, timestamp: Date.now(), content: 'allo', color: 'foo'};
                Note.update(note, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'invalid_color',
                    message: 'Invalid note.color: "foo".'
                });
            });

            it('returns any other error', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.update({userid:'any_error_id', timestamp: Date.now(), content: 'error'}, callback);
                expect(callback).toBeCalledWith(AWS.DynamoDB.SampleError);
            });

            it('works, with all field already set', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                var note = {
                    userid: AWS.DynamoDB.User1,
                    timestamp: Date.now(),
                    content: 'allo',
                    color: 'red'
                };
                Note.update(note, callback);
                expect(callback).toBeCalledWith(null, note);
            });

            it('works, with color not set', function() {
                var now = Date.now();
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                var note = {
                    userid: AWS.DynamoDB.User1,
                    content: 'allo',
                    timestamp: now,
                };
                Note.update(note, callback);
                var Colors = require('../../models/Colors');
                expect(callback).toBeCalled(); //With(null, note);
                expect(callback.mock.calls[0][0]).toBeNull();
                expect(callback.mock.calls[0][1]).toBeDefined();
                expect(callback.mock.calls[0][1].userid).toBe(AWS.DynamoDB.User1);
                expect(callback.mock.calls[0][1].content).toBe('allo');
                expect(callback.mock.calls[0][1].timestamp).toBe(now);
                expect(callback.mock.calls[0][1].color).toBeDefined();
                expect(Colors.Colors.indexOf(callback.mock.calls[0][1].color) > -1).toBe(true); // valid color name
            });

        });

        // ============================================================================================================
        describe('delete', function() {
            it('returns an error if userid is undefined', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.delete(undefined, Date.now(), callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'undefined_userid',
                    message: "userid can't be undefined."
                });
            });

            it('returns an error if userid is null', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.delete(null, Date.now(), callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'null_userid',
                    message: "userid can't be null."
                });
            });

            it('returns an error if timestamp is undefined', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.delete(AWS.DynamoDB.User1, undefined, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'undefined_timestamp',
                    message: "timestamp can't be undefined."
                });
            });

            it('returns an error if timestamp is null', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.delete(AWS.DynamoDB.User1, null, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'null_timestamp',
                    message: "timestamp can't be null."
                });
            });

            it('returns any other error', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.delete('any_error_id', Date.now(), callback);
                expect(callback).toBeCalledWith(AWS.DynamoDB.SampleError);
            });

            it('deletes succesfully', function() {
                var AWS = require('aws-sdk');
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                var now = Date.now();
                Note.delete(AWS.DynamoDB.User1, now, callback);
                expect(callback).toBeCalledWith(null, AWS.DynamoDB.User1, now);
            });

        });

    });
});
