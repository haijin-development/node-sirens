const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

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
