const expect = require('chai').expect
const SkinsNamespace = require('../../../../../src/skins/SkinsNamespace')

const namespace = SkinsNamespace.new()

describe('When using a SingleSelectionCheckBox', () => {
    let componentRenderer

    beforeEach( () => {
        componentRenderer = namespace.ComponentRenderer.new()
    })

    describe('model', () => {
        it('has a ValueModel with a false value', () => {
            const widget = componentRenderer.render( function() {
                this.checkBox()
            })

            expect(widget.getModel().getValue()) .to .eql(false)
        })

        it('updates the view value when the model value changes', () => {
            const widget = componentRenderer.render( function() {
                this.checkBox()
            })

            widget.getModel().setValue(true)

            expect(widget.getView().getValue()) .to .eql(true)
        })

        it('updates the model value when the view changes', () => {
            const widget = componentRenderer.render( function() {
                this.checkBox()
            })

            widget.getView().setValue(true)
            widget.handleClicked()

            expect(widget.getModel().getValue()) .to .eql(true)
        })
    })

    describe( 'constructor', () =>{
        it('has a false value by default', () => {
            const widget = componentRenderer.render( function() {
                this.checkBox()
            })

            expect(widget.getView().getValue()) .to .eql(false)
        })

        it('sets a value on its constructor', () => {
            const widget = componentRenderer.render( function() {
                this.checkBox({ value: true })
            })

            expect(widget.getModel().getValue()) .to .eql(true)
            expect(widget.getView().getValue()) .to .eql(true)
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            const widget = componentRenderer.render( function() {
                this.checkBox({ width: 10 })
            })

            expect(widget.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            const widget = componentRenderer.render( function() {
                this.checkBox({ height: 10 })
            })

            expect(widget.getView().getHeight()) .to .eql(10)
        })
    })
})
