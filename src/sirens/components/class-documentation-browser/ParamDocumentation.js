const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const Resource = require('../../objects/Resource')

class ParamDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const param = this.getProps().param

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginVertical: 10,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.fileImage({
                    filename: Resource.image.param,
                    width: 48,
                    height: 48,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.label({
                    text: param.Name + ': ',
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.label({
                    text: param.Description,
                    viewAttributes: {
                        stackSize: 'filled',
                    },
                })

            })

            this.verticalSeparator()

        })
    }
}

module.exports = Classification.define(ParamDocumentation)
