const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const GtkIcons = require('../../../../Skins').GtkIcons

class ClassUnformattedCommentComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const classDefinition = flow.getClass()

        const className = classDefinition.getClassName()

        let unformattedComment = flow.getMethodUnformattedComment()

        if( unformattedComment.trim() === '' ) {
            unformattedComment = 'This class has no documentation yet.'
        }

        const isInEditionMode = flow.isInEditionMode()

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {

                this.horizontalStack( function() {
                    this.styles({
                        viewAttributes: { stackSize: 'fixed' },
                    })

                    this.label({ viewAttributes: { stackSize: 'filled' } })

                    this.label({
                        text: `${className} class`,
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
                                flow.editClassUnformattedComment({ parentWindow: this.getProps().window })
                            },
                        })
                    }

                })

                this.verticalSeparator()

                this.text({
                    text: unformattedComment,
                })

            })

        })
    }
}

module.exports = Classification.define(ClassUnformattedCommentComponent)
