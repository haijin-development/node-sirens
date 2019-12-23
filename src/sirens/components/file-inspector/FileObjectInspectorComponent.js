const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

class FileObjectInspectorComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ ComponentProtocol_Implementation ]
    }

    reRenderWhen() {
        const flow = this.getModel()

        this.getProps().fileObjectsTree  = flow.getFlowPoint({ id: 'fileObjects' })

        this.getProps().fileObjectsTree.onSelectionChanged({
            with: this,
            do: function() { this.reRender() },
        })
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render( function(component) {
            this.container({ id: 'selectedFileObject', hasScrollBars: false }, function() {

                const fileComponent = flow.getFileObjectComponent()

                if( fileComponent != null ) {
                    this.component( fileComponent )
                }
            })
        })
    }

    unsubscribeFromModel() {
        this.getProps().fileObjectsTree.dropAllAnnouncementsFor({ listener: this })

        this.previousClassificationDo( () => {
            this.unsubscribeFromModel()
        })
    }
}

module.exports = Classification.define(FileObjectInspectorComponent)
