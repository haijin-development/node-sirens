const expect = require('chai').expect
const SkinsNamespace = require('../../../../../src/skins/SkinsNamespace')

const namespace = SkinsNamespace.new()

describe('When using a TextButton', () => {
    let componentRenderer

    beforeEach( () => {
        componentRenderer = namespace.ComponentRenderer.new()
    })

    describe('model', () => {
        it('has a ValueModel with an empty text', () => {
            const widget = componentRenderer.render( function() {
                this.textButton()
            })

            expect(widget.getModel().getValue()) .to .eql('')
        })

        it('updates the view value when the model text changes', () => {
            const widget = componentRenderer.render( function() {
                this.textButton()
            })

            widget.getModel().setValue('123')

            expect(widget.getView().getText()) .to .eql('123')
        })
    })


    describe( 'constructor', () =>{
        it('has a empty text', () => {
            const widget = componentRenderer.render( function() {
                this.textButton()
            })

            expect(widget.getView().getText()) .to .eql('')
        })

        it('sets a text on its constructor', () => {
            const widget = componentRenderer.render( function() {
                this.textButton({ text: 'label' })
            })

            expect(widget.getModel().getValue()) .to .eql('label')
            expect(widget.getView().getText()) .to .eql('label')
        })
    })

    describe( 'events', () =>{
        it('calls the onClicked callback', () => {
            let clicked = false

            const widget = componentRenderer.render( function() {
                this.textButton({
                    onClicked: () => { clicked = true }
                })
            })

            widget.getView().handleClick()

            expect( clicked ) .to .be .true
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            const widget = componentRenderer.render( function() {
                this.textButton()
            })

            widget.mergeProps({
                width: 10
            })

            expect(widget.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            const widget = componentRenderer.render( function() {
                this.textButton()
            })

            widget.mergeProps({
                height: 10
            })

            expect(widget.getView().getHeight()) .to .eql(10)
        })
    })
})
