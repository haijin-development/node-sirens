const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

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

                this.label({
                    text: param.getName(),
                    css: [ 'title-2', ],
                    wrapeMode: 'wordChar',
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
