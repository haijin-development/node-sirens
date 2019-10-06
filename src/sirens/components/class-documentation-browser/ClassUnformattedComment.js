const path = require('path')
const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const ClassCommentHeader = require ('./ClassCommentHeader')

class ClassUnformattedComment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const className = model.getClassName()

        let unformattedComment = model.getClassUnformattedComment()

        if( unformattedComment.trim() === '' ) {
            unformattedComment = 'This class has no documentation yet.'
        }

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {

                this.component(
                    ClassCommentHeader.new({
                        className: className
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
