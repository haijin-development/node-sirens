const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const FlowModel = require('../../../../src/finger-tips/models/FlowModel')

describe('When building a model using the model builder DSL', () => {

    describe('when building a ValueModel', () => {

        it('builds a ValueModel', () => {
            const model = FlowModel.new({ build: false })

            model.build( function() {
                this.value({ id: 'value-1' })


            })

            const childModel = model.getChild({ id: 'value-1' })

            expect( childModel.getValue() ) .to .be .null
        })

        it('builds a ValueModel with a given value', () => {
            const model = FlowModel.new({ build: false })

            model.build( function() {
                this.value({ id: 'value-1', value: 123 })


            })

            const childModel = model.getChild({ id: 'value-1' })

            expect( childModel.getValue() ) .to .equal( 123 )
        })

    })

})