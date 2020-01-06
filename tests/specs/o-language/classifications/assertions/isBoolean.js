const expect = require('chai').expect
const Validate = require('../../../../../src/o-language/classifications/assertions/Validate')

describe('When making assertions on an object', () => {

    describe('.isBoolean()', () => {
	    it('passes with true', () => {
	        const validationResult = Validate.that({
	        	object: true,
	        	satisfies: function(object) {
					object .isBoolean()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('passes with false', () => {
	        const validationResult = Validate.that({
	        	object: true,
	        	satisfies: function(object) {
					object .isBoolean()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('fails with undefined', () => {
	        const validationResult = Validate.that({
	        	object: undefined,
	        	satisfies: function(object) {
					object .isBoolean()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isBoolean')
	        		expect( failedValidation.getValidatedValue() ) .to .equal(undefined)
	        	})
	    })

	    it('fails with null', () => {
	        const validationResult = Validate.that({
	        	object: null,
	        	satisfies: function(object) {
					object .isBoolean()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isBoolean')
	        		expect( failedValidation.getValidatedValue() ) .to .equal(null)
	        	})
	    })

	    it('fails with an integer', () => {
	        const validationResult = Validate.that({
	        	object: 0,
	        	satisfies: function(object) {
					object .isBoolean()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isBoolean')
	        		expect( failedValidation.getValidatedValue() ) .to .equal(0)
	        	})
	    })

    })

})