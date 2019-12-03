const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const Resource = require('../../../objects/Resource')
const GtkIcons = require('../../../../Skins').GtkIcons

class ParamDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const isInEditionMode = flow.isInEditionMode()

        const param = this.getProps().param

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginVertical: 10,
                })

                this.verticalStack( function() {

                    this.horizontalStack( function() {

                        this.image({
                            filename: Resource.image.param,
                            width: 48,
                            height: 48,
                            viewAttributes: {
                                stackSize: 'fixed',
                            },
                        })

                        this.label({
                            text: param.Name + ': ' + "\n",
                            viewAttributes: {
                                stackSize: 'filled',
                            },
                        })

                        if( isInEditionMode ) {

                            this.verticalStack( function() {

                                this.styles({
                                    viewAttributes: {
                                        stackSize: 'fixed',
                                        stackAlign: 'end',
                                    },
                                })


                                this.textButton({
                                    text: 'Edit...',
                                    image: {
                                        iconName: GtkIcons.edit,
                                        size: GtkIcons.size._16x16,
                                    },
                                    onClicked: () => {
                                        flow.editMethodDocumentationParam({
                                            parentWindow: component.getProps().window,
                                            param: component.getProps().param,
                                            paramIndex: component.getProps().index,

                                        })
                                    },
                                    viewAttributes: { stackSize: 'fixed' },
                                })

                                this.textButton({
                                    text: 'Delete',
                                    image: {
                                        filename: Resource.image.false,
                                        width: 16,
                                        height: 16,
                                    },
                                    onClicked: () => {
                                        const paramIndex = component.getProps().index
                                        flow.deleteMethodDocumentationParam({
                                            atIndex: paramIndex,
                                        })
                                    },
                                    viewAttributes: { stackSize: 'fixed' },
                                })

                            })
                        }

                    })

                    this.horizontalStack( function() {

                        this.label({
                            text: param.Description,
                        })

                    })
                })

            })

        })
    }
}

module.exports = Classification.define(ParamDocumentation)
