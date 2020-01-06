const expect = require('chai').expect
const Validate = require('../../../../../src/o-language/classifications/assertions/Validate')
const Classification = require('../../../../../src/O').Classification
const Protocol = require('../../../../../src/O').Protocol
const OInstance = require('../../../../../src/O').OInstance

describe('When making assertions on an object', () => {

    const protocolToComplyWith = Protocol.define( class ProtocolToComplyWith {} )

	const complientClassification =
		Classification.define( class complientClassification {
            static definition() {
                this.instanceVariables = []
                this.implements = [ protocolToComplyWith ]
            }
		} )

    describe('.compliesWith()', () => {
	    it('passes with an object that complies with the expected Classification', () => {
			const object = complientClassification.new()

	        const validationResult = Validate.that({
	        	object: object,
	        	satisfies: function(object) {
					object .compliesWith( protocolToComplyWith )
	        	},
	        })

	        expect( validationResult.hasFailedValidations() ) .to .be .false
	    })

	    it('fails with a non complient object', () => {
			const object = OInstance.new()

	        const validationResult = Validate.that({
	        	object: object,
	        	satisfies: function(object) {
					object .compliesWith( protocolToComplyWith )
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('compliesWith')
	        		expect( failedValidation.getValidatedValue() ) .to .equal(object)
	        		expect( failedValidation.getValidationData() ) .to .eql({
	        			protocol: protocolToComplyWith
	        		})
	        	})
	    })

	    it('fails with an object', () => {
			const object = complientClassification.new()

	        const validationResult = Validate.that({
	        	object: {},
	        	satisfies: function(object) {
					object .compliesWith( protocolToComplyWith )
	        	},
	        })

	        expect( validationResult.getFailedValidations() ) .count .to .eql(1)

	        expect( validationResult.getFailedValidations() )
	        	.atIndex(0) .to .be .suchThat( function(failedValidation) {
	        		expect( failedValidation.getFailedValidationId() ) .to .equal('compliesWith')
	        		expect( failedValidation.getValidatedValue() ) .to .eql({})
	        	})
	    })

    })

})