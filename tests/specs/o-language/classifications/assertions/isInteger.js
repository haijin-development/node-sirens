const expect = require('chai').expect
const Validate = require('../../../../../src/o-language/classifications/assertions/Validate')

describe('When making assertions on an object', () => {

    describe('.isInteger()', () => {
	    it('passes with an Integer', () => {
	        const validationResult = Validate.that({
	        	object: 123,
	        	satisfies: function(object) {
					object .isInteger()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('fails with a non Integer', () => {
	        const validationResult = Validate.that({
	        	object: '123',
	        	satisfies: function(object) {
					object .isInteger()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isInteger')
	        		expect( failedValidation.getValidatedValue() ) .to .equal('123')
	        	})
	    })

    })

})