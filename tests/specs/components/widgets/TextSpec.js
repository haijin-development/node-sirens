const expect = require('chai').expect
const Text = require('../../../../src/components/widgets/Text')

describe('When using a Text', () => {
    describe('model', () => {
        it('has a ValueModel with an empty text', () => {
            const label = new Text()

            expect(label.getModel().getValue()) .to .eql('')
        })

        it('updates the view value when the model text changes', () => {
            const label = new Text()

            label.getModel().setValue('123')

            expect(label.getView().getText()) .to .eql('123')
        })
    })


    describe( 'constructor', () =>{
        it('has a empty text', () => {
            const label = new Text()

            expect(label.getView().getText()) .to .eql('')
        })

        it('sets a text on its constructor', () => {
            const label = new Text({text: '123'})

            expect(label.getModel().getValue()) .to .eql('123')
            expect(label.getView().getText()) .to .eql('123')
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            const label = new Text()

            label.setProps({
                width: 10
            })

            expect(label.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            const label = new Text()

            label.setProps({
                height: 10
            })

            expect(label.getView().getHeight()) .to .eql(10)
        })

        it('sets and gets the wrapMode', () => {
            const label = new Text()

            label.setProps({
                wrapMode: 'char'
            })

            expect(label.getView().getWrapMode()) .to .eql('char')
        })
    })
})
