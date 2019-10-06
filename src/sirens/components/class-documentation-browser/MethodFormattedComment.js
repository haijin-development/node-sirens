const path = require('path')
const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const MethodCommentHeader = require ('./MethodCommentHeader')
const ParamDocumentation = require('./ParamDocumentation')
const ReturnsDocumentation = require('./ReturnsDocumentation')
const DocumentationPlayground = require ('./DocumentationPlayground')
const ExampleDocumentation = require('./ExampleDocumentation')
const ImplementationNoteDocumentation = require('./ImplementationNoteDocumentation')

class MethodFormattedComment {
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

        if( model.getSelectedMethod() !== null ) {
            methodDeclaration = model.getSelectedMethod().getFunctionSignatureString()
        }

        const documentation = model.getSelectedMethodDocumentation()

        let description = documentation.getDescription()

        if( description.trim() === '' ) {
            description = 'This method has no description.'
        }

        const params = documentation.getParams()

        const returns = documentation.getReturns()

        const implementationNotes = documentation.getImplementationNotes()

        const examples = documentation.getExamples()

        componentsRenderer.render( function(component) {

            this.container( { hScroll: 'never' }, function() {

                this.verticalStack( function() {

                    this.styles({
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                    this.component(
                        MethodCommentHeader.new({
                            methodDeclaration: methodDeclaration,
                        })
                    )

                    this.component(
                        DocumentationPlayground.new({
                            text: description,
                        })
                    )
    
                    params.forEach( (param, index) => {
                        this.component(
                            ParamDocumentation.new({
                                paramIndex: index,
                                param: param,
                            })
                        )
                    })

                    if( returns !== undefined ) {
                        this.component(
                            ReturnsDocumentation.new({
                                returns: returns,
                            })
                        )
                    }

                    implementationNotes.forEach( (implementationNote, index) => {
                        this.component(
                            ImplementationNoteDocumentation.new({
                                index: index,
                                implementationNote: implementationNote,
                            })
                        )
                    })

                    examples.forEach( (example) => {
                        this.component(
                            ExampleDocumentation.new({
                                model: example,
                            })
                        )
                    })

                })

            })

        })
    }
}

module.exports = Classification.define(MethodFormattedComment)
