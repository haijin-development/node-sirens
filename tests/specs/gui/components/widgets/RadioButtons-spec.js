const expect = require('chai').expect
const ChoiceModel = require('../../../../../src/gui/models/ChoiceModel')
const Component = require('../../../../../src/gui/components/Component')

describe('When using a RadioButton group', () => {
    beforeEach( () => {
        this.model = ChoiceModel.new({ choices: ['a', 'b', 'c'] })

        const model = this.model

        this.container = Component.render( function(renderer) {
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

    describe( 'constructor', () =>{
        it('has a empty label', () => {
            const radioButton = Component.render( function(renderer) {
                this.radioButton()
            })

            expect(radioButton.getView().getText()) .to .eql('')
        })

        it('sets a text on its constructor', () => {
            const radioButton = Component.render( function(renderer) {
                this.radioButton({
                    text: 'label'
                })
            })

            expect(radioButton.getView().getText()) .to .eql('label')
        })
    })

    describe('model', () => {
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
