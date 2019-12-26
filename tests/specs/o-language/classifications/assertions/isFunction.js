const expect = require('chai').expect
const Validate = require('../../../../../src/o-language/classifications/assertions/Validate')

describe('When making assertions on an object', () => {

    describe('.isFunction()', () => {
	    it('passes with a Function', () => {
	        const validationResult = Validate.that({
	        	object: function() {},
	        	satisfies: function(object) {
					object .isFunction()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('passes with an Array Function', () => {
	        const validationResult = Validate.that({
	        	object: () => {},
	        	satisfies: function(object) {
					object .isFunction()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('fails with a non function', () => {
	        const validationResult = Validate.that({
	        	object: {},
	        	satisfies: function(object) {
					object .isFunction()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isFunction')
	        		expect( failedValidation.getValidatedValue() ) .to .eql({})
	        	})
	    })

    })

})