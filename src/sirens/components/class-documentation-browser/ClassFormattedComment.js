const path = require('path')
const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const ClassCommentHeader = require ('./ClassCommentHeader')
const DocumentationPlayground = require ('./DocumentationPlayground')
const ExampleDocumentation = require('./ExampleDocumentation')
const ImplementationNoteDocumentation = require('./ImplementationNoteDocumentation')

class ClassFormattedComment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const documentation = model.getClassDocumentation()

        let description = documentation.getDescription()

        if( description.trim() === '' ) {
            description = 'This class has no documentation yet.'
        }

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
                        ClassCommentHeader.new({
                            className: model.getClassName()
                        })
                    )

                    this.component(
                        DocumentationPlayground.new({
                            text: description,
                        })
                    )
    
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

module.exports = Classification.define(ClassFormattedComment)
