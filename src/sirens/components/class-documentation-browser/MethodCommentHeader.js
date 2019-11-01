const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')

const Resource = require('../../objects/Resource')

class MethodCommentHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const method = this.getProps().method

        let methodDeclaration = 'No method is selected.'

        if( method !== null ) {
            methodDeclaration = method.getFunctionSignatureString()
        }

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginBottom: 15,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.image({
                    filename: Resource.image.method,
                    width: 48,
                    height: 48,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.label({
                    text: methodDeclaration,
                    viewAttributes: {
                        stackSize: 'filled',
                    },
                })

            })

        })
    }
}

module.exports = Classification.define(MethodCommentHeader)
