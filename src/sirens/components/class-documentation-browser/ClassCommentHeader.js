const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

const Resource = require('../../objects/Resource')

class ClassCommentHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const className = this.getProps().className

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginBottom: 10,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.image({
                    filename: Resource.image.class,
                    width: 48,
                    height: 48,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.label({
                    text: className,
                    viewAttributes: {
                        stackSize: 'filled',
                    },
                })

            })

        })
    }
}

module.exports = Classification.define(ClassCommentHeader)
