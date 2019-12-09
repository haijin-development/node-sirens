const path = require('path')
const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const ClassCommentHeader = require ('../ClassCommentHeader')
const EditClassDescriptionHeader = require('../EditClassDescriptionHeader')

class ClassUnformattedComment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const classDefinition = flow.getBrowsedClass()

        if( classDefinition === null ) { return }

        const isInEditionMode = flow.isInEditionMode()

        let unformattedComment = classDefinition.getClassComment().getContents()

        if( unformattedComment.trim() === '' ) {
            unformattedComment = 'This class has no documentation yet.'
        }

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {

                if( isInEditionMode ) {
                    this.component(
                        EditClassDescriptionHeader.new({
                            model: flow,
                            editionClosure: () => {
                                flow.editClassUnformattedComment({
                                    parentWindow: component.getProps().window
                                })
                            },
                        })
                    )

                    this.verticalSeparator()
                }

                this.component(
                    ClassCommentHeader.new({
                        className: classDefinition.getClassName(),
                        window: this.getProps().window,
                    })
                )

                this.verticalSeparator()

                this.text({
                    text: unformattedComment,
                })

            })

        })
    }
}

module.exports = Classification.define(ClassUnformattedComment)
