const expect = require('chai').expect

const namespace = require('../../skinsNamespace')

describe('When using a Text', () => {
    let componentRenderer

    beforeEach( () => {
        componentRenderer = namespace.ComponentRenderer.new()
    })

    describe('model', () => {
        it('has a ValueModel with an empty text', () => {
            const widget = componentRenderer.render( function() {
                this.text()
            })

            expect(widget.getModel().getValue()) .to .eql('')
        })

        it('updates the view value when the model text changes', () => {
            const widget = componentRenderer.render( function() {
                this.text()
            })

            widget.getModel().setValue('123')

            expect(widget.getView().getText()) .to .eql('123')
        })
    })


    describe( 'constructor', () =>{
        it('has a empty text', () => {
            const widget = componentRenderer.render( function() {
                this.text()
            })

            expect(widget.getView().getText()) .to .eql('')
        })

        it('sets a text on its constructor', () => {
            const widget = componentRenderer.render( function() {
                this.text({ text: '123' })
            })

            expect(widget.getModel().getValue()) .to .eql('123')
            expect(widget.getView().getText()) .to .eql('123')
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            const widget = componentRenderer.render( function() {
                this.text()
            })

            widget.mergeProps({
                width: 10
            })

            expect(widget.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            const widget = componentRenderer.render( function() {
                this.text()
            })

            widget.mergeProps({
                height: 10
            })

            expect(widget.getView().getHeight()) .to .eql(10)
        })

        it('sets and gets the wrapMode', () => {
            const widget = componentRenderer.render( function() {
                this.text()
            })

            widget.mergeProps({
                wrapMode: 'char'
            })

            expect(widget.getView().getWrapMode()) .to .eql('char')
        })
    })
})
