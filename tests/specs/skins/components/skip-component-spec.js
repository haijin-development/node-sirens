const expect = require('chai').expect
const SkinsNamespace = require('../../../../src/skins/SkinsNamespace')

const Skins = SkinsNamespace.new()

describe('When skipping a component', () => {
    it('does not add the sub-component', () => {
        const componentRenderer = Skins.ComponentRenderer.new()

        const window = componentRenderer.render( function(renderer) {
            this.window( function() {
                this.skip().label().anyOtherMethod()
                this.skip().anyOtherMethod()
            })
        })

        expect( window.getChildComponents() ) .to .eql( [] )
    })
})
