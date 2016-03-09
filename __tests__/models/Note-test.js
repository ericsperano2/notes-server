'use strict';

jest.dontMock('../../models/Note');

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
                    error: 'invalid_userid',
                    message: "Userid can't be undefined."
                });
            });

            it('returns an error if userid is null', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.getAll(null, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'invalid_userid',
                    message: "Userid can't be null."
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
                    error: 'invalid_note',
                    message: "Note can't be undefined."
                });
            });

            it('returns an error if note is null', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.create(null, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'invalid_note',
                    message: "Note can't be null."
                });
            });
            /*

            it('returns an error if note.userid is undefined', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.getAll({}, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'invalid_userid',
                    message: "Note.userid can't be undefined."
                });
            });

            it('returns an error if note.userid is null', function() {
                var Note = require('../../models/Note');
                var callback = jest.genMockFunction();
                Note.getAll({userid:null}, callback);
                expect(callback).toBeCalledWith({
                    appError: true,
                    error: 'invalid_userid',
                    message: "Note.userid can't be null."
                });
            });
            */
        });

    });
});
