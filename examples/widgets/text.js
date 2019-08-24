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

                this.text({value: 'A text'})
            })
        })
    }
}

Sirens.do( () => {
    CustomComponent.open()
})