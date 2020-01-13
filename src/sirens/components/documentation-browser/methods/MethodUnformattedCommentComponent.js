const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

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

        const icon = this.namespace().viewsNamespace().icons

        componentsRenderer.render(function (component) {

            this.verticalStack({ width: 600, }, function() {

                this.horizontalStack( function() {
                    this.spaceFiller()

                    this.label({
                        text: methodSignature,
                        css: [ 'title-1', ],
                        editable: false,
                    })

                    this.spaceFiller()

                    if( isInEditionMode ) {
                        this.textButton({
                            image: {
                                iconName: icon.edit,
                                size: icon.size._16x16,
                            },
                            onClicked: () => {
                                flow.editMethodUnformattedComment({
                                    parentWindow: component.getProps().window
                                })
                            },
                        })
                    }

                })

                this.spaceFiller( function() {
                    this.text({
                        text: methodUnformattedComment,
                    })
                })

            })

        })
    }

    getCurrentMethod() {
        return this.getModel().getFlowPoint({ id: 'selectedMethod' }).getValue()
    }
}

module.exports = Classification.define(MethodUnformattedCommentComponent)
