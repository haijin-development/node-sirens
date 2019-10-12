const path = require('path')
const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../../gui/protocols/ComponentProtocol')
const ClassCommentHeader = require ('../ClassCommentHeader')
const EditClassCommentDialog = require('../edition/EditClassCommentDialog')

class ClassUnformattedComment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Actions

    editClassComment() {
        const model = this.getModel()

        const dialog = EditClassCommentDialog.new({
            model: model,
            window: this.getProps().window,
            onUpdateClassComment: this.updateClassComment.bind(this),
            unformatted: true,
        })

        dialog.open()
    }

    updateClassComment({ newClassDescription: newClassDescription }) {
        const model = this.getModel()

        const newClassComment = `/*\n${newClassDescription}\n*/`

        model.updateClassRawComment( newClassComment )
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const className = model.getClassName()

        const isInEditionMode = model.isInEditionMode()

        const editionClosure = isInEditionMode ?
            this.editClassComment.bind(this) : undefined

        let unformattedComment = model.getClassUnformattedComment()

        if( unformattedComment.trim() === '' ) {
            unformattedComment = 'This class has no documentation yet.'
        }

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {

                this.component(
                    ClassCommentHeader.new({
                        className: className,
                        window: this.getProps().window,
                        editionClosure: editionClosure,
                    })
                )

                this.text({
                    text: unformattedComment,
                })

            })

        })
    }
}

module.exports = Classification.define(ClassUnformattedComment)
