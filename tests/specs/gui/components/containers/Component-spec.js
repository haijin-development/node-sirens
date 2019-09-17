const expect = require('chai').expect
const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../../src/gui/components/Component')
const LabelView = require('../../../../../src/gui/gtk-views/LabelView')

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
