const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

const GtkIcons = require('../../../../skins/gtk-views/constants/GtkIcons')
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

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {
                this.horizontalStack( function() {

                    this.image({
                        filename: Resource.image.file,
                        width: 32,
                        height: 32,
                        viewAttributes: {
                            stackSize: 'fixed',
                            stackPadding: 10,
                            stackAlign: 'end',
                        },
                    })

                    this.label({ text: 'Method source code' })

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
