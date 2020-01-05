const expect = require('chai').expect
const SkinsNamespace = require('../../../../../src/skins/SkinsNamespace')

const namespace = SkinsNamespace.new()

describe('When using a RadioButton group', () => {
    let componentRenderer

    beforeEach( () => {
        componentRenderer = namespace.ComponentRenderer.new()
    })

    describe( 'constructor', () =>{
        it('has a empty label', () => {
            const radioButton = componentRenderer.render( function() {
                this.radioButton({ id: 'radioButton' })
            })

            expect(radioButton.getView().getText()) .to .eql('')
        })

        it('sets a text on its constructor', () => {
            const radioButton = componentRenderer.render( function() {
                this.radioButton({
                    text: 'label'
                })
            })

            expect(radioButton.getView().getText()) .to .eql('label')
        })
    })

    describe('model', () => {
        beforeEach( () => {
            this.model = namespace.Models.ChoiceModel.new({ choices: ['a', 'b', 'c'] })

            const model = this.model

            this.container = componentRenderer.render( function() {
                this.verticalStack( function() {
                    this.radioButton({
                        model: model,
                        id: 'a',
                        text: 'Option 1'
                    })

                    this.radioButton({
                        model: model,
                        id: 'b',
                        text: 'Option 2'
                    })

                    this.radioButton({
                        model: model,
                        id: 'c',
                        text: 'Option 3'
                    })
                })
            })
        })


        it('updates the selection when the model selection changes', () => {
            this.model.setSelectionValue('c')

            const button1 = this.container.getChildComponent({ id: 'a' })
            const button2 = this.container.getChildComponent({ id: 'b' })
            const button3 = this.container.getChildComponent({ id: 'c' })

            expect( button1.getView().getValue() ) .to .eql(false)
            expect( button2.getView().getValue() ) .to .eql(false)
            expect( button3.getView().getValue() ) .to .eql(true)
        })
    })
})
