const expect = require('chai').expect
const CheckBox = require('../../../../src/components/widgets/CheckBox')

describe('When using a CheckBox', () => {
    describe('model', () => {
        it('has a ValueModel with an empty text', () => {
            const label = new CheckBox()

            expect(label.getModel().getValue()) .to .eql(false)
        })

        it('updates the view value when the model value changes', () => {
            const label = new CheckBox()

            label.getModel().setValue(true)

            expect(label.getView().getValue()) .to .eql(true)
        })

        it('updates the model value when the view changes', () => {
            const label = new CheckBox()

            label.getView().setValue(true)
            label.onClicked()

            expect(label.getModel().getValue()) .to .eql(true)
        })
    })

    describe( 'constructor', () =>{
        it('has a false value by default', () => {
            const label = new CheckBox()

            expect(label.getView().getValue()) .to .eql(false)
        })

        it('sets a value on its constructor', () => {
            const label = new CheckBox({value: true})

            expect(label.getModel().getValue()) .to .eql(true)
            expect(label.getView().getValue()) .to .eql(true)
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            const label = new CheckBox()

            label.setProps({
                width: 10
            })

            expect(label.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            const label = new CheckBox()

            label.setProps({
                height: 10
            })

            expect(label.getView().getHeight()) .to .eql(10)
        })
    })
})
