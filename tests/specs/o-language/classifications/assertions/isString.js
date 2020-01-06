const expect = require('chai').expect
const Validate = require('../../../../../src/o-language/classifications/assertions/Validate')

describe('When making assertions on an object', () => {

    describe('.isString()', () => {
	    it('passes with a String', () => {
	        const validationResult = Validate.that({
	        	object: 'text',
	        	satisfies: function(object) {
					object .isString()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('fails with a non String', () => {
	        const validationResult = Validate.that({
	        	object: 123,
	        	satisfies: function(object) {
					object .isString()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isString')
	        		expect( failedValidation.getValidatedValue() ) .to .equal(123)
	        	})
	    })

    })

})