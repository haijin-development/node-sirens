const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const ModelObject = require('../../../../src/skins/models/ModelObject')

describe('When building a model using the model builder DSL', () => {

    describe('when building a ValueModel', () => {

        it('builds a ValueModel', () => {
            const model = ModelObject.new({ build: false })

            model.build( function() {
                this.value({ id: 'value-1' })


            })

            const childModel = model.getChild({ id: 'value-1' })

            expect( childModel.getValue() ) .to .be .null
        })

        it('builds a ValueModel with a given value', () => {
            const model = ModelObject.new({ build: false })

            model.build( function() {
                this.value({ id: 'value-1', value: 123 })


            })

            const childModel = model.getChild({ id: 'value-1' })

            expect( childModel.getValue() ) .to .equal( 123 )
        })

    })

})