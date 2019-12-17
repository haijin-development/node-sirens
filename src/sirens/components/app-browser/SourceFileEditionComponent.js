const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const FileInspectorBody = require('../file-inspector/FileInspectorBody')

class SourceFileEditionComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    reRenderWhen() {
        const flow = this.getModel()

        this.reRenderOnValueChangeOf( flow )
    }

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {

                this.component(
                    FileInspectorBody.new({
                        model: flow,
                    })
                )

            })
        })
    }
}

module.exports = Classification.define(SourceFileEditionComponent)
