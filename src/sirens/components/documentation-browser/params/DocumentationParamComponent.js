const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const Resource = require('../../../objects/Resource')
const GtkIcons = require('../../../../Skins').GtkIcons

class DocumentationParamComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const param = flow.getValue()

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {

                this.styles({
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.label({
                    text: param.getName(),
                    css: [ 'title-2', ],
                    wrapeMode: 'wordChar',
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.text({
                    text: param.getDescription(),
                    editable: false,
                    wrapeMode: 'wordChar',
                    hasScrollBars: false,
                })

            })

        })
    }
}

module.exports = Classification.define(DocumentationParamComponent)
