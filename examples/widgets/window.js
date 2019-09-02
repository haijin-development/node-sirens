const Sirens = require('../../src/Sirens')
const Component = require('../../src/gui/components/Component')
const ComponentInstantiator = require('../../src/gui/components/ComponentInstantiator')

class CustomComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
    }

    /// Building

    renderWith(builder) {
        builder.render(function (component) {
            this.window( function() {
                this.styles({
                    width: 100,
                    height: 100,
                })
            })
        })
    }
}

CustomComponent = ComponentInstantiator.define(CustomComponent)

Sirens.do( () => {
    CustomComponent.new().open()
})