const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../../gui/protocols/ComponentProtocol')
const Resource = require('../../../objects/Resource')
const GtkIcons = require('../../../../gui/gtk-views/constants/GtkIcons')

class ReturnsHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginVertical: 10,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.image({
                    filename: Resource.image.returns,
                    width: 16,
                    height: 16,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.label({
                    viewAttributes: {
                        stackSize: 'filled',
                    },
                })

                this.textButton({
                    text: 'Edit return parameter...',
                    image: {
                        iconName: GtkIcons.edit,
                        size: GtkIcons.size._16x16,
                    },
                    onClicked: component.handleEditReturns.bind(component),                        
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.label({
                    viewAttributes: {
                        stackSize: 'filled',
                    },
                })

            })

        })
    }

    /// Events

    handleEditReturns() {
        this.getProps().editReturns()
    }

}

module.exports = Classification.define(ReturnsHeader)
