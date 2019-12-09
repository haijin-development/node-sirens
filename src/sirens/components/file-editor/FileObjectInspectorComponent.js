const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation
const TextualContentComponent = require('./TextualContentComponent')
const JsClassComponent = require('./JsClassComponent')
const Pluggables = require('../../../sirens/objects/Pluggables')

class FileObjectInspectorComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ ComponentProtocol_Implementation ]
    }

    reRenderWhen() {
        const flow = this.getModel()

        this.reRenderOnValueChangeOf( flow )
    }

    /// Rendering

    renderWith(componentsRenderer) {
        componentsRenderer.render( function(component) {
            this.container({ id: 'selectedSectionContents', hasScrollBars: false }, function() {

                const fileComponent = component.createComponentForSelectedFile()

                if( fileComponent != null ) {
                    this.component( fileComponent )
                }
            })
        })
    }

    createComponentForSelectedFile() {
        const flow = this.getModel()

        const objectFile = flow.getValue()

        if( ! objectFile ) { return null }

        const fileObjectType = objectFile.getFileObjectType()

        let componentClassification = Pluggables.fileInspectorComponents[fileObjectType]

        if( componentClassification === undefined ) {
            componentClassification = Pluggables.fileInspectorComponents.default
        }

        return componentClassification.new({
            model: flow,
        })

    }
}

module.exports = Classification.define(FileObjectInspectorComponent)
