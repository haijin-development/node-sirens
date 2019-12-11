const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

class JsonContentComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ ComponentProtocol_Implementation ]
    }

    /// Rendering

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const fileObject = flow.getValue()

        componentsRenderer.render( function(component) {

            this.treeChoice( function(tree) {
                const treeModel = flow.getFlowPoint({ id: 'jsonProperties' })

                this.model( treeModel )

                this.styles({
                    showHeaders: false,
                    clickableHeaders: false,
                })

                this.column({
                    label: '',
                    getImageClosure: function(instVar) { return instVar.icon() },
                    imageWidth: 24,
                    imageHeight: 24,
                })

                this.column({
                    label: '',
                    getTextClosure: function(instVar) { return instVar.displayString() },
                })

            })

        })
    }
}

module.exports = Classification.define(JsonContentComponent)
