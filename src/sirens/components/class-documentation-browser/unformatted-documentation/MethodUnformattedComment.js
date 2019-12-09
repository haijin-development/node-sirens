const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const Resource = require('../../../objects/Resource')
const EditMethodDescriptionHeader = require('../EditMethodDescriptionHeader')
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

        const selectedMethodModel = model.getFlowPoint({ id: 'selectedMethod' })

        this.reRenderOnValueChangeOf( selectedMethodModel )
    }

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const method = this.getCurrentMethod()

        if( ! method ) { return }

        const isInEditionMode = flow.isInEditionMode()

        let methodUnformattedComment = method.getMethodComment().getContents()

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
                            model: flow,
                            method: method,
                            editionClosure: () => {
                                flow.editMethodUnformmatedComment({
                                    parentWindow: component.getProps().window,
                                })
                            },
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

    getCurrentMethod() {
        return this.getModel().getFlowPoint({ id: 'selectedMethod' }).getValue()
    }
}

module.exports = Classification.define(MethodUnformattedComment)
