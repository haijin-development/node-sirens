const path = require('path')
const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const ClassCommentHeader = require ('../ClassCommentHeader')
const EditClassCommentDialog = require('../edition/EditClassCommentDialog')
const EditClassDescriptionHeader = require('../EditClassDescriptionHeader')

class ClassUnformattedComment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Actions

    editClassComment() {
        const model = this.getModel()

        model.executeCommandClosure({
            commandId: 'editClassComment',
            closure: () => {
                const model = this.getModel()

                const classDefinition = model.getBrowsedClass()

                const className = classDefinition.getClassName()

                const classComment = classDefinition.getComment().getSourceCode()

                const dialog = EditClassCommentDialog.new({
                    className: className,
                    classComment: classComment,
                    window: this.getProps().window,
                    onUpdateClassComment: model.getActionHandler({ id: 'updateClassComment' }),
                })

                dialog.open()
            }
        })
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const classDefinition = model.getBrowsedClass()

        if( classDefinition === null ) { return }

        const isInEditionMode = model.isInEditionMode()

        const editionClosure = this.editClassComment.bind(this)

        let unformattedComment = classDefinition.getComment().getSourceCode()

        if( unformattedComment.trim() === '' ) {
            unformattedComment = 'This class has no documentation yet.'
        }

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {

                if( isInEditionMode ) {
                    this.component(
                        EditClassDescriptionHeader.new({
                            model: model,
                            editionClosure: editionClosure,
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
