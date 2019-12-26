const expect = require('chai').expect
const Validate = require('../../../../../src/o-language/classifications/assertions/Validate')

describe('When making assertions on an object', () => {

    describe('.isUndefined()', () => {
	    it('passes with undefined', () => {
	        const validationResult = Validate.that({
	        	object: undefined,
	        	satisfies: function(object) {
					object .isUndefined()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('fails with null', () => {
	        const validationResult = Validate.that({
	        	object: null,
	        	satisfies: function(object) {
					object .isUndefined()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isUndefined')
	        		expect( failedValidation.getValidatedValue() ) .to .equal(null)
	        	})
	    })

	    it('fails with 0', () => {
	        const validationResult = Validate.that({
	        	object: 0,
	        	satisfies: function(object) {
					object .isUndefined()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isUndefined')
	        		expect( failedValidation.getValidatedValue() ) .to .equal(0)
	        	})
	    })

	    it('fails with false', () => {
	        const validationResult = Validate.that({
	        	object: false,
	        	satisfies: function(object) {
					object .isUndefined()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isUndefined')
	        		expect( failedValidation.getValidatedValue() ) .to .equal(false)
	        	})
	    })

	    it('fails with an object', () => {
	        const validationResult = Validate.that({
	        	object: 123,
	        	satisfies: function(object) {
					object .isUndefined()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isUndefined')
	        		expect( failedValidation.getValidatedValue() ) .to .equal(123)
	        	})
	    })

    })

    describe('.isNotUndefined()', () => {
	    it('fails with undefined', () => {
	        const validationResult = Validate.that({
	        	object: undefined,
	        	satisfies: function(object) {
					object .isNotUndefined()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isNotUndefined')
	        		expect( failedValidation.getValidatedValue() ) .to .equal(undefined)
	        	})
	    })

	    it('passes with null', () => {
	        const validationResult = Validate.that({
	        	object: null,
	        	satisfies: function(object) {
					object .isNotUndefined()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('passes with 0', () => {
	        const validationResult = Validate.that({
	        	object: 0,
	        	satisfies: function(object) {
					object .isNotUndefined()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('passes with false', () => {
	        const validationResult = Validate.that({
	        	object: false,
	        	satisfies: function(object) {
					object .isNotUndefined()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('passes with an object', () => {
	        const validationResult = Validate.that({
	        	object: 123,
	        	satisfies: function(object) {
					object .isNotUndefined()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

    })

})