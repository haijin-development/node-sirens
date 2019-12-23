const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const GtkIcons = require('../../../../Skins').GtkIcons

class MethodUnformattedCommentComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const methodSignature = flow.getMethodSignature()

        let methodUnformattedComment = flow.getMethodUnformattedComment()

        if( methodUnformattedComment.trim() === '' ) {
            methodUnformattedComment = 'This method has no documentation yet.'
        }

        const isInEditionMode = flow.isInEditionMode()

        componentsRenderer.render(function (component) {

            this.verticalStack({ width: 600, }, function() {

                this.horizontalStack( function() {
                    this.styles({
                        viewAttributes: { stackSize: 'fixed' },
                    })

                    this.label({ viewAttributes: { stackSize: 'filled' } })

                    this.label({
                        text: methodSignature,
                        css: [ 'title-1', ],
                        editable: false,
                        viewAttributes: { stackSize: 'fixed' },
                    })

                    this.label({ viewAttributes: { stackSize: 'filled' } })

                    if( isInEditionMode ) {
                        this.textButton({
                            image: {
                                iconName: GtkIcons.edit,
                                size: GtkIcons.size._16x16,
                            },
                            viewAttributes: { stackSize: 'fixed' },
                            onClicked: () => {
                                flow.editMethodUnformattedComment({ parentWindow: this.getProps().window })
                            },
                        })
                    }

                })

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

module.exports = Classification.define(MethodUnformattedCommentComponent)
