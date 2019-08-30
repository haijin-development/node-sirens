const Sirens = require('../../src/Sirens')
const Classification = require('../../src/o-language/classifications/Classification')
const ComponentClassification = require('../../src/gui/components/ComponentClassification')
const Component = require('../../src/gui/components/Component')

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

                this.checkBox({ label: 'A checkbox' })
            })
        })
    }
}

const customComponent = Classification.define(CustomComponent)

customComponent.behaveAs( ComponentClassification )

Sirens.do( () => {
    customComponent.open()
})