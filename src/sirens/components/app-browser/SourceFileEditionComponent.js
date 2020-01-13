const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')
const FileInspectorBodyComponent = require('../file-inspector/FileInspectorBodyComponent')

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

            this.component(
                FileInspectorBodyComponent.new({
                    model: flow,
                    window: component.getProps().window,
                })
            )

        })
    }
}

module.exports = Classification.define(SourceFileEditionComponent)
