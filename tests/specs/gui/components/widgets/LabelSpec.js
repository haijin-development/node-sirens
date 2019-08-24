const expect = require('chai').expect
const Label = require('../../../../../src/gui/components/widgets/Label')

describe('When using a Label', () => {
    describe('model', () => {
        it('has a ValueModel with an empty text', () => {
            const label = Label.new()

            expect(label.getModel().getValue()) .to .eql('')
        })

        it('updates the view value when the model text changes', () => {
            const label = Label.new()

            label.getModel().setValue('123')

            expect(label.getView().getText()) .to .eql('123')
        })
    })


    describe( 'constructor', () =>{
        it('has a empty text', () => {
            const label = Label.new()

            expect(label.getView().getText()) .to .eql('')
        })

        it('sets a text on its constructor', () => {
            const label = Label.new({text: 'label'})

            expect(label.getModel().getValue()) .to .eql('label')
            expect(label.getView().getText()) .to .eql('label')
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            const label = Label.new()

            label.setProps({
                width: 10
            })

            expect(label.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            const label = Label.new()

            label.setProps({
                height: 10
            })

            expect(label.getView().getHeight()) .to .eql(10)
        })
    })
})
