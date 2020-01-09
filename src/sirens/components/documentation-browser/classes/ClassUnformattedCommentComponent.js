const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

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

        const icon = this.namespace().viewsNamespace().icons

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {

                this.horizontalStack( function() {
                    this.spaceFiller()

                    this.label({
                        text: `${className} class`,
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
                                flow.editClassUnformattedComment({
                                    parentWindow: component.getProps().window
                                })
                            },
                        })
                    }

                })

                this.verticalSeparator()

                this.spaceFiller( function() {
                    this.text({
                        text: unformattedComment,
                    })                    
                })
            })

        })
    }
}

module.exports = Classification.define(ClassUnformattedCommentComponent)
