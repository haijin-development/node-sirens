const expect = require('chai').expect
const Component = require('../../../../../src/gui/components/Component')

describe('When using a TextButton', () => {
    describe('model', () => {
        it('has a ValueModel with an empty text', () => {
            const widget = Component.render( function(renderer) {
                this.textButton()
            })

            expect(widget.getModel().getValue()) .to .eql('')
        })

        it('updates the view value when the model text changes', () => {
            const widget = Component.render( function(renderer) {
                this.textButton()
            })

            widget.getModel().setValue('123')

            expect(widget.getView().getText()) .to .eql('123')
        })
    })


    describe( 'constructor', () =>{
        it('has a empty text', () => {
            const widget = Component.render( function(renderer) {
                this.textButton()
            })

            expect(widget.getView().getText()) .to .eql('')
        })

        it('sets a text on its constructor', () => {
            const widget = Component.render( function(renderer) {
                this.textButton({ text: 'label' })
            })

            expect(widget.getModel().getValue()) .to .eql('label')
            expect(widget.getView().getText()) .to .eql('label')
        })
    })

    describe( 'events', () =>{
        beforeEach( () => {
            this.clicked = false
        })

        it('calls the onClicked callback', () => {
            const widget = Component.render( (renderer) => {
                renderer.textButton({
                    onClicked: () => { this.clicked = true }
                })
            })

            widget.getView().handleClick()

            expect( this.clicked ) .to .be .true
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            const widget = Component.render( function(renderer) {
                this.textButton()
            })

            widget.mergeProps({
                width: 10
            })

            expect(widget.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            const widget = Component.render( function(renderer) {
                this.textButton()
            })

            widget.mergeProps({
                height: 10
            })

            expect(widget.getView().getHeight()) .to .eql(10)
        })
    })
})
