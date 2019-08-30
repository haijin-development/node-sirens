const expect = require('chai').expect
const CheckBox = require('../../../../../src/gui/components/widgets/CheckBox')

describe('When using a CheckBox', () => {
    describe('model', () => {
        it('has a ValueModel with an empty text', () => {
            const widget = CheckBox.new()

            expect(widget.getModel().getValue()) .to .eql(false)
        })

        it('updates the view value when the model value changes', () => {
            const widget = CheckBox.new()

            widget.getModel().setValue(true)

            expect(widget.getView().getValue()) .to .eql(true)
        })

        it('updates the model value when the view changes', () => {
            const widget = CheckBox.new()

            widget.getView().setValue(true)
            widget.onClicked()

            expect(widget.getModel().getValue()) .to .eql(true)
        })
    })

    describe( 'constructor', () =>{
        it('has a false value by default', () => {
            const widget = CheckBox.new()

            expect(widget.getView().getValue()) .to .eql(false)
        })

        it('sets a value on its constructor', () => {
            const widget = CheckBox.new({ value: true })

            expect(widget.getModel().getValue()) .to .eql(true)
            expect(widget.getView().getValue()) .to .eql(true)
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            const widget = CheckBox.new()

            widget.setProps({
                width: 10
            })

            expect(widget.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            const widget = CheckBox.new()

            widget.setProps({
                height: 10
            })

            expect(widget.getView().getHeight()) .to .eql(10)
        })
    })
})
