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

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'editClassUnformattedComment',
            enabledIf: () => { return true },
            whenActioned: this.editClassUnformattedComment.bind(this),
        })

        const classDefinition = model.getBrowsedClass()

        if( classDefinition === null ) { return }

        const isInEditionMode = model.isInEditionMode()

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
                            editionClosure: model.getActionHandler({ id: 'editClassUnformattedComment' }),
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

    /// Commands

    editClassUnformattedComment() {
        const model = this.getModel()

        const classDefinition = model.getBrowsedClass()

        const className = classDefinition.getClassName()

        const classComment = classDefinition.getComment().getSourceCode()

        const dialog = EditClassCommentDialog.new({
            className: className,
            classComment: classComment,
            window: this.getProps().window,
            onUpdateClassComment: model.getActionHandler({ id: 'updateClassUnformattedComment' }),
        })

        dialog.open()
    }
}

module.exports = Classification.define(ClassUnformattedComment)
