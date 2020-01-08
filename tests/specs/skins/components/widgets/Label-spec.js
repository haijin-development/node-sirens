const expect = require('chai').expect

const namespace = require('../../skinsNamespace')

describe('When using a Label', () => {
    let componentRenderer

    beforeEach( () => {
        componentRenderer = namespace.ComponentRenderer.new()
    })

    describe('model', () => {
        it('has a ValueModel with an empty text', () => {
            const label = componentRenderer.render( function() {
                this.label()
            })

            expect(label.getModel().getValue()) .to .eql('')
        })

        it('updates the view value when the model text changes', () => {
            const label = componentRenderer.render( function() {
                this.label()
            })

            label.getModel().setValue('123')

            expect(label.getView().getText()) .to .eql('123')
        })
    })


    describe( 'constructor', () =>{
        it('has a empty text', () => {
            const label = componentRenderer.render( function() {
                this.label()
            })

            expect(label.getView().getText()) .to .eql('')
        })

        it('sets a text on its constructor', () => {
            const label = componentRenderer.render( function() {
                this.label({ text: 'label' })
            })

            expect(label.getModel().getValue()) .to .eql('label')
            expect(label.getView().getText()) .to .eql('label')
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            const label = componentRenderer.render( function() {
                this.label()
            })

            label.mergeProps({
                width: 10
            })

            expect(label.getView().getWidth()) .to .eql(10)
        })

        it('sets and gets the height', () => {
            const label = componentRenderer.render( function() {
                this.label()
            })

            label.mergeProps({
                height: 10
            })

            expect(label.getView().getHeight()) .to .eql(10)
        })
    })
})
