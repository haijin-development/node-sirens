const expect = require('chai').expect
const ChoiceModel = require('../../../../../src/gui/models/ChoiceModel')
const Stack = require('../../../../../src/gui/components/containers/Stack')
const RadioButton = require('../../../../../src/gui/components/widgets/RadioButton')

describe('When using a RadioButton group', () => {
    beforeEach( () => {
        this.model = ChoiceModel.new({ choices: ['a', 'b', 'c'] })

        this.button1 = RadioButton.new({
            model: this.model,
            id: 'a',
            label: 'Option 1'
        })

        this.button2 = RadioButton.new({
            model: this.model,
            id: 'b',
            label: 'Option 2'
        })

        this.button3 = RadioButton.new({
            model: this.model,
            id: 'c',
            label: 'Option 3'
        })

        this.container = Stack.new({orientation: 'horizontal'})

        this.container.addAllComponents(
            [this.button1, this.button2, this.button3]
        )
    })

    describe( 'constructor', () =>{
        it('has a empty label', () => {
            const radioButton = RadioButton.new()

            expect(radioButton.getView().getText()) .to .eql('')
        })

        it('sets a text on its constructor', () => {
            const label = RadioButton.new({text: 'label'})

            expect(label.getView().getText()) .to .eql('label')
        })
    })

    describe('model', () => {
        it('updates the selection when the model selection changes', () => {
            this.model.setSelection('c')

            expect(this.button1.getView().getValue()) .to .eql(false)
            expect(this.button2.getView().getValue()) .to .eql(false)
            expect(this.button3.getView().getValue()) .to .eql(true)
        })
    })
})
