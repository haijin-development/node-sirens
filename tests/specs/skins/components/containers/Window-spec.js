const expect = require('chai').expect

const namespace = require('../../skinsNamespace')

describe('When using a Window', () => {
    it('instantiates an empty one', () => {
        const window = namespace.ComponentRenderer.new().render( function(renderer) {
            this.window()
        })

        expect( window.getChildComponents() ) .to .eql([])
    })

    it('adds a sub-component', () => {
        const window = namespace.ComponentRenderer.new().render( function(renderer) {
            this.window( function() {
                this.label()
            })
        })

        expect( window.getChildComponents() ) .count .to .eql(1)

        expect( window.getChildComponents() ) .atIndex(0) .to .be .suchThat( (component) => {
            expect( component.getView() ) .to .behaveAs( 'LabelView' )
        })
    })
})
