const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const GtkIcons = require('../../../../Skins').GtkIcons
const Resource = require('../../../objects/Resource')
const Preferences = require('../../../objects/Preferences')

class MethodSourceCodeDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {

        const method = this.getProps().method

        const methodSourceCode = method === null ? '' : method.getFunctionFormattedSourceCode()

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {
                this.horizontalStack( function() {

                    this.image({
                        filename: Resource.image.file,
                        width: 48,
                        height: 48,
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

module.exports = Classification.define(MethodSourceCodeDocumentation)
