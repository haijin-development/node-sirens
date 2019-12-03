const path = require('path')
const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const ClassCommentHeader = require ('../ClassCommentHeader')
const PlaygroundComponent = require ('../../shared/PlaygroundComponent')
const EditClassDescriptionHeader = require('../EditClassDescriptionHeader')
const ImplementationNotesEditionHeader = require ('./ImplementationNotesEditionHeader')
const ImplementationNoteDocumentation = require('./ImplementationNoteDocumentation')
const ExampleDocumentation = require('./ExampleDocumentation')
const ExamplesEditionHeader = require('./ExamplesEditionHeader')

class ClassFormattedComment {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const isInEditionMode = flow.isInEditionMode()

        const documentation = flow.getFlowPoint({ id: 'classDocumentation' }).getValue()

        if( documentation === null ) { return }

        const className = documentation.getClassName()

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

                    if( isInEditionMode ) {
                        this.component(
                            EditClassDescriptionHeader.new({
                                model: flow,
                                editionClosure: () => {
                                    flow.editClassDocumentationComment({ parentWindow: this.getProps().window })
                                },
                            })
                        )

                        this.verticalSeparator()
                    }

                    this.component(
                        ClassCommentHeader.new({
                            className: className,
                            window: this.getProps().window,
                        })
                    )

                    this.component(
                        PlaygroundComponent.new({
                            id: 'playground',
                            text: "\n" + description + "\n",
                            hScroll: 'never',
                            vScroll: 'never',
                            viewAttributes: {
                                stackSize: 'fixed',
                            },
                        })
                    )
    
                    this.verticalSeparator()

                    if( isInEditionMode ) {
                        this.component(
                            ImplementationNotesEditionHeader.new({
                                model: flow,
                                createClosure: () => {
                                    flow.createClassDocumentationImplementationNote({ parentWindow: component })
                                },
                            })
                        )

                        this.verticalSeparator()
                    }

                    implementationNotes.forEach( (implementationNote, index) => {
                        this.verticalSeparator()

                        this.component(
                            ImplementationNoteDocumentation.new({
                                model: flow,
                                index: index,
                                implementationNote: implementationNote,
                                editClosure: () => {
                                    flow.editClassDocumentationImplementationNote({
                                        parentWindow: component,
                                        atIndex: index,
                                        implementationNoteText: implementationNote
                                    })
                                },
                                deleteClosure: () => {
                                    flow.deleteClassDocumentationImplementationNote({ atIndex: index })
                                },
                            })
                        )
                    })

                    if( isInEditionMode ) {
                        this.component(
                            ExamplesEditionHeader.new({
                                model: flow,
                                addClosure: () => {
                                    flow.createClassDocumentationExample({ parentWindow: component })
                                },
                            })
                        )

                        this.verticalSeparator()
                    }

                    examples.forEach( (example, index) => {
                        this.verticalSeparator()

                        this.component(
                            ExampleDocumentation.new({
                                model: flow,
                                example: example,
                                editClosure: () => {
                                    flow.editClassDocumentationExample({ atIndex: index, example: example })
                                },
                                deleteClosure: () => {
                                    flow.deleteClassDocumentationExample({ atIndex: index })
                                },
                            })
                        )
                    })

                })

            })

        })
    }
}

module.exports = Classification.define(ClassFormattedComment)
