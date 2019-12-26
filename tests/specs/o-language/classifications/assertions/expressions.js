const expect = require('chai').expect
const Validate = require('../../../../../src/o-language/classifications/assertions/Validate')

describe('When using expressions', () => {

    describe('.andThen()', () => {
        it('evaluates the right assertion if the left one passes', () => {
            const validationResult = Validate.that({
                object: '123',
                satisfies: function(object) {
                    object .isString() .andThen() .isUndefined()
                },
            })

            expect( validationResult.getFailedValidations() ) .count .to .eql(1)

            expect( validationResult.getFailedValidations() )
                .atIndex(0) .to .be .suchThat( function(failedValidation) {
                    expect( failedValidation.getFailedValidationId() ) .to .equal('isUndefined')
                    expect( failedValidation.getValidatedValue() ) .to .equal('123')
                })
        })

        it('does not evaluate the right assertion if the left one fails', () => {
            const validationResult = Validate.that({
                object: '123',
                satisfies: function(object) {
                    object .isUndefined() .andThen() .isNull()
                },
            })

            expect( validationResult.getFailedValidations() ) .count .to .eql(1)

            expect( validationResult.getFailedValidations() )
                .atIndex(0) .to .be .suchThat( function(failedValidation) {
                    expect( failedValidation.getFailedValidationId() ) .to .equal('isUndefined')
                    expect( failedValidation.getValidatedValue() ) .to .equal('123')
                })
        })

        it('concatenates .andThen() assertions', () => {
            const validationResult = Validate.that({
                object: '123',
                satisfies: function(object) {
                    object .isNotUndefined() .andThen() .isString() .andThen() .isNull()
                },
            })

            expect( validationResult.getFailedValidations() ) .count .to .eql(1)

            expect( validationResult.getFailedValidations() )
                .atIndex(0) .to .be .suchThat( function(failedValidation) {
                    expect( failedValidation.getFailedValidationId() ) .to .equal('isNull')
                    expect( failedValidation.getValidatedValue() ) .to .equal('123')
                })
        })

    })

    describe('.or()', () => {
        it('does not evaluate the right assertion if the left passes', () => {
            const validationResult = Validate.that({
                object: undefined,
                satisfies: function(object) {
                    object .isUndefined() .or() .isString()
                },
            })

            expect( validationResult.getFailedValidations() ) .count .to .eql(0)
        })

        it('evaluates the right assertion if the left one fails', () => {
            const validationResult = Validate.that({
                object: null,
                satisfies: function(object) {
                    object .isUndefined() .or() .isNull()
                },
            })

            expect( validationResult.getFailedValidations() ) .count .to .eql(0)
        })

        it('adds a ValidationFailure if both left and right expressions fail', () => {
            const validationResult = Validate.that({
                object: '123',
                satisfies: function(object) {
                    object .isUndefined() .or() .isNull()
                },
            })

            expect( validationResult.getFailedValidations() ) .count .to .eql(1)

            expect( validationResult.getFailedValidations() )
                .atIndex(0) .to .be .suchThat( function(failedValidation) {
                    expect( failedValidation.getFailedValidationId() ) .to .eql( 'or' )
                    expect( failedValidation.getValidatedValue() ) .to .equal('123')
                })
        })

    })

    describe('.withEach()', () => {
        it('evaluates the assertion for each item in the iterable object', () => {
            const validationResult = Validate.that({
                object: [1, 2, undefined],
                satisfies: function(object) {
                    object .withEach( (each) => {
                        each .isNotUndefined()
                    })
                },
            })

            expect( validationResult.getFailedValidations() ) .count .to .eql(1)

            expect( validationResult.getFailedValidations() )
                .atIndex(0) .to .be .suchThat( function(failedValidation) {
                    expect( failedValidation.getFailedValidationId() ) .to .equal('target[2].isNotUndefined')
                    expect( failedValidation.getValidatedValue() ) .to .eql( [1, 2, undefined] )
                })
        })
    })

    describe('.with()', () => {
        it('evaluates the assertion for each item in the iterable object using a property name', () => {
            const validationResult = Validate.that({
                object: { prop1: 1, prop2: undefined },
                satisfies: function(object) {
                    object
                        .with( 'prop1', (object) => {
                            object .isNotUndefined()
                        })
                        .andThen()
                        .with( 'prop2', (object) => {
                            object .isNotUndefined()
                        })
                },
            })

            expect( validationResult.getFailedValidations() ) .count .to .eql(1)

            expect( validationResult.getFailedValidations() )
                .atIndex(0) .to .be .suchThat( function(failedValidation) {
                    expect( failedValidation.getFailedValidationId() ) .to .equal('target.prop2.isNotUndefined')
                    expect( failedValidation.getValidatedValue() ) .to .eql( { prop1: 1, prop2: undefined } )
                })
        })

        it('evaluates the assertion for each item in the iterable object using a getter closure', () => {
            const validationResult = Validate.that({
                object: { prop1: 1, prop2: undefined },
                satisfies: function(object) {
                    object
                        .with( (object) => { return object.prop1 }, (object) => {
                            object .isNotUndefined()
                        })
                        .andThen()
                        .with( (object) => { return object.prop2 }, (object) => {
                            object .isNotUndefined()
                        })
                },
            })

            expect( validationResult.getFailedValidations() ) .count .to .eql(1)

            expect( validationResult.getFailedValidations() )
                .atIndex(0) .to .be .suchThat( function(failedValidation) {
                    expect( failedValidation.getFailedValidationId() ) .to .equal('target.(object) => { return object.prop2 }.isNotUndefined')
                    expect( failedValidation.getValidatedValue() ) .to .eql( { prop1: 1, prop2: undefined } )
                })
        })

    })

    describe('chaining assertion is an implicit .andThen()', () => {
        it('evaluates the right assertion if the left one passes', () => {
            const validationResult = Validate.that({
                object: '123',
                satisfies: function(object) {
                    object .isString() .isUndefined()
                },
            })

            expect( validationResult.getFailedValidations() ) .count .to .eql(1)

            expect( validationResult.getFailedValidations() )
                .atIndex(0) .to .be .suchThat( function(failedValidation) {
                    expect( failedValidation.getFailedValidationId() ) .to .equal('isUndefined')
                    expect( failedValidation.getValidatedValue() ) .to .equal('123')
                })
        })

    })

})