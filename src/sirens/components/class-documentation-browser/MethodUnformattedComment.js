const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const Resource = require('../../objects/Resource')
const MethodCommentHeader = require('./MethodCommentHeader')

class MethodUnformattedComment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    reRenderWhen() {
        const selectedMethodModel = this.getModel().getSelectedMethodModel()

        this.reRenderOnValueChangeOf( selectedMethodModel )
    }

    renderWith(componentsRenderer) {
        const model = this.getModel()

        let methodDeclaration = 'No method selected.'
        let methodUnformattedComment = ''

        const method = model.getSelectedMethod()

        if( method !== null ) {
            methodDeclaration = method.getFunctionSignatureString()

            methodUnformattedComment = method.getComment().getString()
        }

        if( methodUnformattedComment.trim() === '' ) {
            methodUnformattedComment = 'This method has no documentation yet.'
        }

        componentsRenderer.render(function (component) {

            this.verticalStack( function() {

                this.component(
                    MethodCommentHeader.new({
                        methodDeclaration: methodDeclaration,
                    })
                )

                this.text({
                    text: methodUnformattedComment,
                })

            })

        })
    }
}

module.exports = Classification.define(MethodUnformattedComment)
