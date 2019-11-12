const path = require('path')
const Classification = require('../../../O').Classification
const Component = require('../../../GUI').Component
const ComponentProtocol_Implementation = require('../../../GUI').ComponentProtocol_Implementation


class FileFooterComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {

            this.text({
                model: model,
                viewAttributes: { splitProportion: 1.0 / 2 },
            })

        })
    }
}

module.exports = Classification.define(FileFooterComponent)
