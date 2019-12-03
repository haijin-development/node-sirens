const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

class ClassHeaderComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ ComponentProtocol_Implementation ]
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render( function(component) {

            this.text({
                model: flow.getFlowPoint({ id: 'editedContents' }),
                viewAttributes: { splitProportion: 1.0 / 2 },
            })

        })
    }
}

module.exports = Classification.define(ClassHeaderComponent)
