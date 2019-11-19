const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const EditParamDialog = require ('../edition/EditParamDialog')

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

    /// Commands

    handleEditParam() {
        const model = this.getModel()

        const param = this.getProps().param
        const paramIndex = this.getProps().index

        model.executeCommandClosure({
            commandId: 'editMethodDocumentationParam',
            closure: () => {
                const paramIndex = this.getProps().index

                const className = model.getBrowsedClass().getClassName()

                const method = model.getChild({ id: 'selectedMethod' }).getValue()

                const dialog = EditParamDialog.new({
                    className: className,
                    method: method,
                    param: param,
                    window: this.getProps().window,
                    onUpdateParam: ({ param: newParam }) => {
                        const actionHandler = model.getActionHandler({ id: 'updateMethodDocumentationParam' })
                        actionHandler({ atIndex: paramIndex, newParam: newParam })
                    },
                    acceptButtonLabel: `Update param`,
                })

                dialog.open()
            }
        })
    }

    handleDeleteParam() {
        const paramIndex = this.getProps().index

        const model = this.getModel()

        const actionHandler = model.getActionHandler({ id: 'deleteMethodDocumentationParam' })

        actionHandler({ atIndex: paramIndex })
    }
}

module.exports = Classification.define(ParamDocumentation)
