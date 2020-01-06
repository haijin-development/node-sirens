const expect = require('chai').expect
const Validate = require('../../../../../src/o-language/classifications/assertions/Validate')
const Classification = require('../../../../../src/O').Classification

describe('When making assertions on an object', () => {

	const classificationToBehaveAs =
		Classification.define( class classificationToBehaveAs {} )

	const anotherClassification =
		Classification.define( class anotherClassification {} )

    describe('.behavesAs()', () => {
	    it('passes with an object that behaves as the expected Classification', () => {
			const object = classificationToBehaveAs.new()

	        const validationResult = Validate.that({
	        	object: object,
	        	satisfies: function(object) {
					object .behavesAs(classificationToBehaveAs)
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('fails with an object that does not behave as the expected Classification', () => {
			const object = anotherClassification.new()

	        const validationResult = Validate.that({
	        	object: object,
	        	satisfies: function(object) {
					object .behavesAs(classificationToBehaveAs)
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('behavesAs')
	        		expect( failedValidation.getValidatedValue() ) .to .equal(object)
	        		expect( failedValidation.getValidationData() ) .to .eql({
	        			classification: classificationToBehaveAs,
	        		})
	        	})
	    })

	    it('fails with an object', () => {
			const object = anotherClassification.new()

	        const validationResult = Validate.that({
	        	object: {},
	        	satisfies: function(object) {
					object .behavesAs(classificationToBehaveAs)
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('behavesAs')
	        		expect( failedValidation.getValidatedValue() ) .to .eql({})
	        	})
	    })

    })

})