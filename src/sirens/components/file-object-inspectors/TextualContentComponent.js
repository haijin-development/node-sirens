const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')

class TextualContentComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ ComponentProtocol_Implementation ]
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const text = flow.getText()

        componentsRenderer.render( function(component) {

            this.text({
                text: text,
            })

        })
    }
}

module.exports = Classification.define(TextualContentComponent)
