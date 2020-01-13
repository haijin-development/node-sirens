const expect = require('chai').expect
const Classification = require('../../../../../src/O').Classification
const Component = require('../../../../../src/skins/components/Component')

const namespace = require('../../skinsNamespace')

class CustomComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
    }

    /// Building

    renderWith(componentsRenderer) {
        componentsRenderer.render(function (component) {
            this.label()
        })
    }
}

CustomComponent = Classification.define(CustomComponent)

describe('When using a Component', () => {
    it('instantiates an empty one', () => {
        const component = namespace.ComponentRenderer.new().render( function(renderer) {
            this.component(
                CustomComponent.new()
            )
        })

        expect( component.getChildComponents() ) .count .to .eql(1)

        expect( component.getChildComponents() ) .atIndex(0) .to .be .suchThat( (component) => {
            expect( component.getView() ) .to .behaveAs( 'LabelView' )
        })
    })
})
