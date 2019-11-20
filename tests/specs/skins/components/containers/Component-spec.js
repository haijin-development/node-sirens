const expect = require('chai').expect
const Classification = require('../../../../../src/O').Classification
const Component = require('../../../../../src/skins/components/Component')
const LabelView = require('../../../../../src/skins/gtk-views/LabelView')

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
        const component = Component.render( function(renderer) {
            this.component(
                CustomComponent.new()
            )
        })

        expect( component.getChildComponents().length ) .to .eql(1)
        expect( component.getChildComponents()[0].getView().isBehavingAs(LabelView) ) .to .be .true
    })
})
