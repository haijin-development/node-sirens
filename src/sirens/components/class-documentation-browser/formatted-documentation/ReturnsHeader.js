const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const EditReturnsDialog = require('../edition/EditReturnsDialog')

const Resource = require('../../../objects/Resource')
const GtkIcons = require('../../../../Skins').GtkIcons

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

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'editMethodDocumentationReturn',
            enabledIf: () => { return true },
            whenActioned: this.editReturns.bind(this),
        })

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
                    onClicked: model.getActionHandler({ id: 'editMethodDocumentationReturn' }),                        
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

    /// Edit returns

    editReturns() {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const method = model.getChild({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        const dialog = EditReturnsDialog.new({
            className: className,
            method: method,
            returns: documentation.getReturns(),
            window: this.getProps().window,
            onUpdateReturns: model.getActionHandler({ id: 'updateMethodDocumentationReturn' }),
            acceptButtonLabel: `Update returns`,
        })

        dialog.open()
    }
}

module.exports = Classification.define(ReturnsHeader)
