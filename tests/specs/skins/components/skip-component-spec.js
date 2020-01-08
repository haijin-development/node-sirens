const expect = require('chai').expect

const namespace = require('../skinsNamespace')

describe('When skipping a component', () => {
    it('does not add the sub-component', () => {
        const componentRenderer = namespace.ComponentRenderer.new()

        const window = componentRenderer.render( function(renderer) {
            this.window( function() {
                this.skip().label().anyOtherMethod()
                this.skip().anyOtherMethod()
            })
        })

        expect( window.getChildComponents() ) .to .eql( [] )
    })
})
