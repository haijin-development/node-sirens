const expect = require('chai').expect
const Validate = require('../../../../../src/o-language/classifications/assertions/Validate')

describe('When making assertions on an object', () => {

    describe('.isObject()', () => {
	    it('passes with an Object', () => {
	        const validationResult = Validate.that({
	        	object: {},
	        	satisfies: function(object) {
					object .isObject()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('fails with null', () => {
	        const validationResult = Validate.that({
	        	object: null,
	        	satisfies: function(object) {
					object .isObject()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isObject')
	        		expect( failedValidation.getValidatedValue() ) .to .eql(null)
	        	})
	    })

	    it('fails with an Array', () => {
	        const validationResult = Validate.that({
	        	object: [],
	        	satisfies: function(object) {
					object .isObject()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isObject')
	        		expect( failedValidation.getValidatedValue() ) .to .eql([])
	        	})
	    })

	    it('fails with a scalar', () => {
	        const validationResult = Validate.that({
	        	object: 123,
	        	satisfies: function(object) {
					object .isObject()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isObject')
	        		expect( failedValidation.getValidatedValue() ) .to .eql(123)
	        	})
	    })

    })

})