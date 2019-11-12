const Classification = require('../../../../O').Classification
const Component = require('../../../../GUI').Component
const ComponentProtocol_Implementation = require('../../../../GUI').ComponentProtocol_Implementation

const Resource = require('../../../objects/Resource')
const GtkIcons = require('../../../../GUI').GtkIcons

class ReturnsHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
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
