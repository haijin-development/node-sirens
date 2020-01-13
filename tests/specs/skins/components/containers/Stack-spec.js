const expect = require('chai').expect

const namespace = require('../../skinsNamespace')

describe('When using a Stack', () => {
    describe('horizontal', () => {
        it('instantiates an empty one', () => {
            const stack = namespace.ComponentRenderer.new().render( function(renderer) {
                this.horizontalStack()
            })

            expect(stack.getChildComponents()) .to .eql([])
        })

        it('adds sub-components', () => {
            const stack = namespace.ComponentRenderer.new().render( function(renderer) {
                this.horizontalStack( function() {
                    this.label()

                    this.label()
                })
            })

            expect( stack.getChildComponents() ) .count .to .eql(2)

            expect( stack.getChildComponents() ) .atIndex(0) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( stack.getChildComponents() ) .atIndex(1) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })
        })
    })

    describe('vertical', () => {
        it('instantiates an empty one', () => {
            const stack = namespace.ComponentRenderer.new().render( function(renderer) {
                this.verticalStack( function() {
                })
            })

            expect(stack.getChildComponents()) .to .eql([])
        })

        it('adds sub-components', () => {
            const stack = namespace.ComponentRenderer.new().render( function(renderer) {
                this.verticalStack( function() {
                    this.label()

                    this.label()
                })
            })

            expect( stack.getChildComponents() ) .count .to .eql(2)

            expect( stack.getChildComponents() ) .atIndex(0) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })

            expect( stack.getChildComponents() ) .atIndex(1) .to .be .suchThat( (component) => {
                expect( component.getView() ) .to .behaveAs( 'LabelView' )
            })
        })
    })
})
