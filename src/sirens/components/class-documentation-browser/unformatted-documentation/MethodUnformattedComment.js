const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../../gui/protocols/ComponentProtocol')
const Resource = require('../../../objects/Resource')
const EditMethodDescriptionHeader = require('../EditMethodDescriptionHeader')
const EditMethodCommentDialog = require('../edition/EditMethodCommentDialog')
const MethodCommentHeader = require('../MethodCommentHeader')

class MethodUnformattedComment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Actions

    editMethodComment() {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        const dialog = EditMethodCommentDialog.new({
            model: model,
            method: method,
            window: this.getProps().window,
            onUpdateMethodComment: this.updateMethodComment.bind(this),
            unformatted: true,
        })

        dialog.open()
    }

    updateMethodComment({ methodNewDescription: methodNewDescription }) {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        method.getComment().writeRawSourceCode({ rawSourceCode: methodNewDescription })

        model.reload()
    }

    /// Building

    reRenderWhen() {
        const selectedMethodModel = this.getModel().getSelectedMethodModel()

        this.reRenderOnValueChangeOf( selectedMethodModel )
    }

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const method = model.getSelectedMethod()

        const isInEditionMode = model.isInEditionMode()

        const editionClosure = isInEditionMode ?
            this.editMethodComment.bind(this) : undefined

        let methodUnformattedComment = ''

        if( method !== null ) {
            methodUnformattedComment = method.getComment().getSourceCode()

            if( methodUnformattedComment.trim() === '' ) {
                methodUnformattedComment = 'This method has no documentation yet.'
            }
        }

        componentsRenderer.render(function (component) {

            this.verticalStack({ width: 600, }, function() {

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

                this.component(
                    MethodCommentHeader.new({
                        method: method,
                    })
                )

                this.verticalSeparator()

                this.text({
                    text: methodUnformattedComment,
                })

            })

        })
    }
}

module.exports = Classification.define(MethodUnformattedComment)
