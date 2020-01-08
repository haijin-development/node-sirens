const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

const Resource = require('../../../objects/Resource')

class MethodSourceCodeDocumentationComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {

        const method = this.getProps().method

        const methodSourceCode = method === null ? '' : method.getFormattedSourceCode()

        const icon = this.namespace().viewsNamespace().icons

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {
                this.horizontalStack( function() {

                    this.spaceFiller()

                    this.label({ text: 'Method source code' })

                    this.spaceFiller()

                    this.image({
                        filename: Resource.image.file,
                        width: 32,
                        height: 32,
                        viewAttributes: {
                            stackPadding: 10,
                        },
                    })

                })

                this.verticalSeparator()

                this.text({
                    text: methodSourceCode,
                    vScroll: 'never',
                })
            })

        })
    }
}

module.exports = Classification.define(MethodSourceCodeDocumentationComponent)
