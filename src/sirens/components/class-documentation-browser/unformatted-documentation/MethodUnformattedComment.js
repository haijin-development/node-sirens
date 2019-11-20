const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const Resource = require('../../../objects/Resource')
const EditMethodDescriptionHeader = require('../EditMethodDescriptionHeader')
const EditMethodCommentDialog = require('../edition/EditMethodCommentDialog')
const MethodCommentHeader = require('../MethodCommentHeader')

class MethodUnformattedComment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    reRenderWhen() {
        const model = this.getModel()

        const selectedMethodModel = model.getChild({ id: 'selectedMethod' })

        this.reRenderOnValueChangeOf( selectedMethodModel )
    }

    renderWith(componentsRenderer) {
        const model = this.getModel()

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'editMethodUnformmatedComment',
            enabledIf: () => { return true },
            whenActioned: this.editMethodUnformmatedComment.bind(this),
        })

        const method = this.getCurrentMethod()

        if( ! method ) { return }

        const isInEditionMode = model.isInEditionMode()

        let methodUnformattedComment = method.getComment().getSourceCode()

        if( methodUnformattedComment.trim() === '' ) {
            methodUnformattedComment = 'This method has no documentation yet.'
        }

        componentsRenderer.render(function (component) {

            this.verticalStack({ width: 600, }, function() {

                this.component(
                    MethodCommentHeader.new({
                        method: method,
                    })
                )

                this.verticalSeparator()

                if( method !== null && isInEditionMode ) {
                    this.component(
                        EditMethodDescriptionHeader.new({
                            model: model,
                            method: method,
                            editionClosure: model.getActionHandler({ id: 'editMethodUnformmatedComment' }),
                        })
                    )

                    this.verticalSeparator()
                }

                this.verticalSeparator()

                this.text({
                    text: methodUnformattedComment,
                })

            })

        })
    }


    /// Actions

    editMethodUnformmatedComment() {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const dialog = EditMethodCommentDialog.new({
            className: className,
            method: method,
            window: this.getProps().window,
            onUpdateMethodComment: model.getActionHandler({ id: 'updateMethodUnformmatedComment' }),
            unformatted: true,
        })

        dialog.open()
    }

    getCurrentMethod() {
        return this.getModel().getChild({ id: 'selectedMethod' }).getValue()
    }
}

module.exports = Classification.define(MethodUnformattedComment)
