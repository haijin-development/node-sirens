const expect = require('chai').expect
const TextButton = require('../../../../../src/gui/components/widgets/TextButton')

describe('When using a TextButton', () => {
    describe('model', () => {
        it('has a ValueModel with an empty text', () => {
            const label = new TextButton()

            expect(label.getModel().getValue()) .to .eql('')
        })

        it('updates the view value when the model text changes', () => {
            const label = new TextButton()

            label.getModel().setValue('123')

            expect(label.getView().getText()) .to .eql('123')
        })
    })


    describe( 'constructor', () =>{
        it('has a empty text', () => {
            const label = new TextButton()

            expect(label.getView().getText()) .to .eql('')
        })

        it('sets a text on its constructor', () => {
            const label = new TextButton({text: 'label'})

            expect(label.getModel().getValue()) .to .eql('label')
            expect(label.getView().getText()) .to .eql('label')
        })
    })

    describe( 'events', () =>{
        beforeEach( () => {
            this.clicked = false
        })

        it('calls the onClicked callback', () => {
            const label = new TextButton({
                onClicked: () => {this.clicked = true}
            })

            label.getView().onClick()

            expect(this.clicked) .to .eql(true)
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            const label = new TextButton()

            label.setProps({
                width: 10
            })

            expect(label.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            const label = new TextButton()

            label.setProps({
                height: 10
            })

            expect(label.getView().getHeight()) .to .eql(10)
        })
    })
})
