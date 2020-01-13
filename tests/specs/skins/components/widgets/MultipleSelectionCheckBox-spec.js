const expect = require('chai').expect

const namespace = require('../../skinsNamespace')

describe('When using a MultipleSelectionCheckBox-spec', () => {
    let componentRenderer

    beforeEach( () => {
        componentRenderer = namespace.ComponentRenderer.new()
    })

    describe('model', () => {
        it('has a ValueModel with an empty value', () => {
            const widget = componentRenderer.render( function() {
                this.multipleCheckBox({
                    item: 'Item 1',
                })
            })

            expect( widget.getModel().getValue() ) .to .eql( [] )
        })

        it('updates the view value when the model value changes', () => {
            const widget = componentRenderer.render( function() {
                this.multipleCheckBox({
                    item: 'Item 1',
                })
            })

            widget.getModel().setValue(['Item 1', 'Item 2'])

            expect( widget.getView().getValue() ) .to .be .true

            widget.getModel().setValue(['Item 2'])

            expect( widget.getView().getValue() ) .to .be .false
        })

        it('updates the model value when the view changes', () => {
            const widget = componentRenderer.render( function() {
                this.multipleCheckBox({
                    item: 'Item 1',
                })
            })

            widget.getModel().setValue(['Item 2'])

            widget.getView().setValue( true )
            widget.handleClicked()

            expect( widget.getModel().getValue() ) .to .eql( ['Item 2', 'Item 1'] )
        })

        it('does not add the same item twice when the view changes', () => {
            const widget = componentRenderer.render( function() {
                this.multipleCheckBox({
                    item: 'Item 1',
                })
            })

            widget.getModel().setValue(['Item 1'])

            widget.getView().setValue( true )
            widget.handleClicked()

            expect( widget.getModel().getValue() ) .to .eql( ['Item 1'] )
        })
    })

    describe( 'constructor', () =>{
        it('raises an error if it does not define an item', () => {
            expect( () => {

                const widget = componentRenderer.render( function() {
                    this.multipleCheckBox({
                    })
                })

            }).to .throw(`A MultipleSelectionCheckBox expects an item defined.`)
        })

        it('has an initial false value', () => {
            const widget = componentRenderer.render( function() {
                this.multipleCheckBox({
                    item: 'Item 1',
                })
            })

            expect( widget.getView().getValue() ) .to .be .false
        })

        it('sets a true value if the model includes the item', () => {
            const model = namespace.Models.ValueModel.new({ value: ['Item 1'] })

            const widget = componentRenderer.render( function() {
                this.multipleCheckBox({
                    model: model,
                    item: 'Item 1',
                })
            })

            expect( widget.getView().getValue() ) .to .be .true
        })
    })

    describe('styles', () => {
        it('sets and gets the width', () => {
            const widget = componentRenderer.render( function() {
                this.multipleCheckBox({
                    item: 'Item 1',
                    width: 10,
                })
            })

            expect( widget.getView().getWidth() ) .to .eql(10)
        })
    })
})
