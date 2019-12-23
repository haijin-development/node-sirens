const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const Resource = require('../../../objects/Resource')

class DocumentationReturnValueComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const returns = flow.getValue()

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {

                this.styles({
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.label({
                    text: 'Returns',
                    css: [ 'title-2', ],
                    wrapeMode: 'wordChar',
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.text({
                    text: returns.getDescription(),
                    editable: false,
                    wrapeMode: 'wordChar',
                    hasScrollBars: false,
                })

            })

        })
    }
}

module.exports = Classification.define(DocumentationReturnValueComponent)
