const expect = require('chai').expect
const Validate = require('../../../../../src/o-language/classifications/assertions/Validate')

describe('When making assertions on an object', () => {

    describe('.isArray()', () => {
	    it('passes with an Array', () => {
	        const validationResult = Validate.that({
	        	object: [],
	        	satisfies: function(object) {
					object .isArray()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('fails with a String', () => {
	        const validationResult = Validate.that({
	        	object: 'text',
	        	satisfies: function(object) {
					object .isArray()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isArray')
	        		expect( failedValidation.getValidatedValue() ) .to .eql('text')
	        	})
	    })

	    it('fails with a non Array', () => {
	        const validationResult = Validate.that({
	        	object: {},
	        	satisfies: function(object) {
					object .isArray()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isArray')
	        		expect( failedValidation.getValidatedValue() ) .to .eql({})
	        	})
	    })

    })

})