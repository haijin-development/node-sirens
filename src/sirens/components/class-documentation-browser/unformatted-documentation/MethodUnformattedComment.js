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

        const method = this.getCurrentMethod()

        if( ! method ) { return }

        const isInEditionMode = model.isInEditionMode()

        const editionClosure = isInEditionMode ?
            this.editMethodComment.bind(this) : undefined

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
                            editionClosure: editionClosure,
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

    editMethodComment() {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const dialog = EditMethodCommentDialog.new({
            className: className,
            method: method,
            window: this.getProps().window,
            onUpdateMethodComment: this.updateMethodComment.bind(this),
            unformatted: true,
        })

        dialog.open()
    }

    updateMethodComment({ methodNewDescription: methodNewDescription }) {
        const model = this.getModel()

        const method = this.getCurrentMethod()

        method.getComment().writeRawSourceCode({ rawSourceCode: methodNewDescription })

        model.reload()
    }

    getCurrentMethod() {
        return this.getModel().getChild({ id: 'selectedMethod' }).getValue()
    }
}

module.exports = Classification.define(MethodUnformattedComment)
