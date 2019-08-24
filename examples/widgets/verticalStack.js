const Sirens = require('../../src/Sirens')
const ComponentClassification = require('../../src/gui/components/ComponentClassification')
const Component = require('../../src/gui/components/Component')

class CustomComponent extends ComponentClassification {
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

                this.verticalStack( function() {

                    this.label({text: 'Label 1'})
                    this.label({text: 'Label 2'})
                    this.label({text: 'Label 3'})

                })
            })
        })
    }
}

Sirens.do( () => {
    CustomComponent.open()
})
