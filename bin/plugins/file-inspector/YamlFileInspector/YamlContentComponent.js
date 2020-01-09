const Classification = require('../../../../src/O').Classification
const Component = require('../../../../src/skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../src/skins/protocols/ComponentProtocol_Implementation')

class YamlContentComponent {
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
                const treeModel = flow.getFlowPoint({ id: 'yamlProperties' })

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

module.exports = Classification.define(YamlContentComponent)
