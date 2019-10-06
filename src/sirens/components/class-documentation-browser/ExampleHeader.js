const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const Resource = require('../../objects/Resource')

class ExampleHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const exampleNumber = this.getProps().exampleNumber + 1

        const exampleDescription = this.getProps().exampleDescription

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginVertical: 10,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.fileImage({
                    filename: Resource.image.haiku,
                    width: 48,
                    height: 48,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.verticalStack( function() {
                    this.label({
                        text: `Example # ${exampleNumber}`,
                    })

                    this.label({
                        text: exampleDescription,
                    })
                })

            })

            this.verticalSeparator()
        })
    }
}

module.exports = Classification.define(ExampleHeader)
