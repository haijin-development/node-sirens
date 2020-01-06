const expect = require('chai').expect
const Validate = require('../../../../../src/o-language/classifications/assertions/Validate')

describe('When making assertions on an object', () => {

    describe('.isEmpty()', () => {
	    it('passes with an empty array', () => {
	        const validationResult = Validate.that({
	        	object: [],
	        	satisfies: function(object) {
					object .isEmpty()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('passes with an empty string', () => {
	        const validationResult = Validate.that({
	        	object: '',
	        	satisfies: function(object) {
					object .isEmpty()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('fails with a non empty array', () => {
	        const validationResult = Validate.that({
	        	object: [1],
	        	satisfies: function(object) {
					object .isEmpty()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isEmpty')
	        		expect( failedValidation.getValidatedValue() ) .to .eql([1])
	        	})
	    })

	    it('fails with a non empty string', () => {
	        const validationResult = Validate.that({
	        	object: ' ',
	        	satisfies: function(object) {
					object .isEmpty()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isEmpty')
	        		expect( failedValidation.getValidatedValue() ) .to .eql(' ')
	        	})
	    })

	    it('fails with a scalar', () => {
	        const validationResult = Validate.that({
	        	object: 123,
	        	satisfies: function(object) {
					object .isEmpty()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isEmpty')
	        		expect( failedValidation.getValidatedValue() ) .to .eql(123)
	        	})
	    })

	    it('fails with an object', () => {
	        const validationResult = Validate.that({
	        	object: {},
	        	satisfies: function(object) {
					object .isEmpty()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isEmpty')
	        		expect( failedValidation.getValidatedValue() ) .to .eql({})
	        	})
	    })

    })

    describe('.isNotEmpty()', () => {
	    it('passes with a non empty array', () => {
	        const validationResult = Validate.that({
	        	object: [1],
	        	satisfies: function(object) {
					object .isNotEmpty()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('passes with a non empty string', () => {
	        const validationResult = Validate.that({
	        	object: ' ',
	        	satisfies: function(object) {
					object .isNotEmpty()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('passes with a scalar', () => {
	        const validationResult = Validate.that({
	        	object: 123,
	        	satisfies: function(object) {
					object .isNotEmpty()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('passes with an object', () => {
	        const validationResult = Validate.that({
	        	object: {},
	        	satisfies: function(object) {
					object .isNotEmpty()
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('fails with an empty array', () => {
	        const validationResult = Validate.that({
	        	object: [],
	        	satisfies: function(object) {
					object .isNotEmpty()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isNotEmpty')
	        		expect( failedValidation.getValidatedValue() ) .to .eql([])
	        	})
	    })

	    it('fails with an empty string', () => {
	        const validationResult = Validate.that({
	        	object: '',
	        	satisfies: function(object) {
					object .isNotEmpty()
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('isNotEmpty')
	        		expect( failedValidation.getValidatedValue() ) .to .eql('')
	        	})
	    })

    })

})