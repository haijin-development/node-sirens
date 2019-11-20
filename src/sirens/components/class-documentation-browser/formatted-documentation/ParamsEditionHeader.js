const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const EditParamDialog = require ('../edition/EditParamDialog')

const GtkIcons = require('../../../../Skins').GtkIcons
const Resource = require('../../../objects/Resource')

class ParamsEditionHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Actions


    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'createMethodDocumentationParam',
            enabledIf: () => { return true },
            whenActioned: this.createMethodDocumentationParam.bind(this),
        })

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginVertical: 10,
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.image({
                    filename: Resource.image.param,
                    width: 16,
                    height: 16,
                    viewAttributes: { stackSize: 'fixed' },
                })

                // To center the button horizontally
                this.label({
                    viewAttributes: { stackSize: 'filled' },
                })

                this.textButton({
                    text: 'Add a new Parameter ...',
                    image: {
                        iconName: GtkIcons.add,
                        size: GtkIcons.size._16x16,
                    },
                    viewAttributes: { stackSize: 'fixed' },
                    onClicked: model.getActionHandler({ id: 'createMethodDocumentationParam' }),
                })

                // To center the button horizontally
                this.label({
                    viewAttributes: { stackSize: 'filled' },
                })

            })

        })
    }

    createMethodDocumentationParam() {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()
        const method = model.getChild({ id: 'selectedMethod' }).getValue()
        const newParam = {
            Name: 'Add the name of the parameter here ...',
            Description: 'Add the parameter description ...',
        }
        const dialog = EditParamDialog.new({
            className: className,
            method: method,
            param: newParam,
            window: this.getProps().window,
            onUpdateParam: model.getActionHandler({ id: 'addMethodDocumentationParam' }),
            acceptButtonLabel: `Add param`,
        })

        dialog.open()
    }
}

module.exports = Classification.define(ParamsEditionHeader)
