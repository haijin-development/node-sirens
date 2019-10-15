const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../../gui/protocols/ComponentProtocol')
const Resource = require('../../../objects/Resource')
const GtkIcons = require('../../../../gui/gtk-views/constants/GtkIcons')

class ParamDocumentation {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const isInEditionMode = model.isInEditionMode()

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
                            this.textButton({
                                text: 'Edit...',
                                image: {
                                    iconName: GtkIcons.edit,
                                    size: GtkIcons.size._16x16,
                                },
                                onClicked: component.handleEditParam.bind(component),
                                viewAttributes: {
                                    stackSize: 'fixed',
                                    stackAlign: 'end',
                                },
                            })

                            this.textButton({
                                text: 'Delete',
                                image: {
                                    filename: Resource.image.false,
                                    width: 16,
                                    height: 16,
                                },
                                onClicked: component.handleDeleteParam.bind(component),
                                viewAttributes: {
                                    stackSize: 'fixed',
                                    stackAlign: 'end',
                                },
                            })
                        }

                    })

                    this.horizontalStack( function() {

                        this.label({
                            text: param.Description,
                            viewAttributes: {
                                stackSize: 'fixed',
                            },
                        })

                    })
                })

            })

        })
    }

    /// Events

    handleEditParam() {
        const paramIndex = this.getProps().index

        this.getProps().editParam({
            atIndex: paramIndex
        })
    }

    handleDeleteParam() {
        const paramIndex = this.getProps().index

        this.getProps().deleteParam({
            atIndex: paramIndex
        })
    }

}

module.exports = Classification.define(ParamDocumentation)
