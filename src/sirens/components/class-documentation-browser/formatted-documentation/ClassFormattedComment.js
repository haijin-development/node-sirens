const path = require('path')
const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const ClassCommentHeader = require ('../ClassCommentHeader')
const EditClassCommentDialog = require('../edition/EditClassCommentDialog')
const PlaygroundComponent = require ('../../shared/PlaygroundComponent')
const EditClassDescriptionHeader = require('../EditClassDescriptionHeader')
const ImplementationNotesEditionHeader = require ('./ImplementationNotesEditionHeader')
const ImplementationNoteDocumentation = require('./ImplementationNoteDocumentation')
const EditImplementationNoteDialog = require('../edition/EditImplementationNoteDialog')
const ExampleDocumentation = require('./ExampleDocumentation')
const ExamplesEditionHeader = require('./ExamplesEditionHeader')
const EditExampleDialog = require('../edition/EditExampleDialog')

class ClassFormattedComment {
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
            id: 'editClassDocumentationComment',
            enabledIf: () => { return true },
            whenActioned: this.editClassDocumentationComment.bind(this),
        })

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'createClassDocumentationImplementationNote',
            enabledIf: () => { return true },
            whenActioned: this.createClassDocumentationImplementationNote.bind(this),
        })

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'editClassDocumentationImplementationNote',
            enabledIf: () => { return true },
            whenActioned: this.editClassDocumentationImplementationNote.bind(this),
        })

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'createClassDocumentationExample',
            enabledIf: () => { return true },
            whenActioned: this.createClassDocumentationExample.bind(this),
        })

        // Since the application uses a custom dialog override this command.
        model.defineCommand({
            id: 'editClassDocumentationExample',
            enabledIf: () => { model.isInEditionMode() && model.getBrowsedClass() },
            whenActioned: this.editClassDocumentationExample.bind(this),
        })

        const isInEditionMode = model.isInEditionMode()

        const documentation = model.getChild({ id: 'classDocumentation' }).getValue()

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
                                model: model,
                                editionClosure: model.getActionHandler({ id: 'editClassDocumentationComment' }),
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
                                model: model,
                                createClosure: model.getActionHandler({ id: 'createClassDocumentationImplementationNote' }),
                            })
                        )

                        this.verticalSeparator()
                    }

                    implementationNotes.forEach( (implementationNote, index) => {
                        this.verticalSeparator()

                        this.component(
                            ImplementationNoteDocumentation.new({
                                model: model,
                                index: index,
                                implementationNote: implementationNote,
                                editClosure: () => {
                                    const handler = model.getActionHandler({ id: 'editClassDocumentationImplementationNote' })
                                    handler({ atIndex: index, implementationNoteText: implementationNote })
                                },
                                deleteClosure: () => {
                                    const handler = model.getActionHandler({ id: 'deleteClassDocumentationImplementationNote' })
                                    handler({ atIndex: index })
                                },
                            })
                        )
                    })

                    if( isInEditionMode ) {
                        this.component(
                            ExamplesEditionHeader.new({
                                model: model,
                                addClosure: model.getActionHandler({ id: 'createClassDocumentationExample' }),
                            })
                        )

                        this.verticalSeparator()
                    }

                    examples.forEach( (example, index) => {
                        this.verticalSeparator()

                        this.component(
                            ExampleDocumentation.new({
                                model: model,
                                example: example,
                                editClosure: () => {
                                    const handler = model.getActionHandler({ id: 'editClassDocumentationExample' })
                                    handler({ atIndex: index, example: example })
                                },
                                deleteClosure: () => {
                                    const handler = model.getActionHandler({ id: 'deleteClassDocumentationExample' })
                                    handler({ atIndex: index })
                                },
                            })
                        )
                    })

                })

            })

        })
    }

    editClassDocumentationComment() {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const classDocumentation = model.getChild({ id: 'classDocumentation' }).getValue()

        let classComment = classDocumentation.getDescription()

        if( classComment.trim() === '' ) {
            classComment = 'This class has no documentation yet.'
        }

        const dialog = EditClassCommentDialog.new({
            className: className,
            classComment: classComment,
            window: this.getProps().window,
            onUpdateClassComment: model.getActionHandler({ id: 'updateClassDocumentationComment' }),
        })

        dialog.open()
    }

    createClassDocumentationImplementationNote() {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const dialog = EditImplementationNoteDialog.new({
            className: className,
            implementationNoteText: 'Add the new implementation note here ...',
            window: this.getProps().window,
            onUpdateImplementationNote: model.getActionHandler({ id: 'addClassDocumentationImplementationNote' }),
            acceptButtonLabel: `Add implementation note`,
            title: `${className} implementation note.`,
            subtitle: `You are editing an implementation note of the class ${className}.`,
        })

        dialog.open()
    }

    editClassDocumentationImplementationNote({ atIndex: index, implementationNoteText: implementationNoteText }) {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const dialog = EditImplementationNoteDialog.new({
            className: className,
            implementationNoteText: implementationNoteText,
            window: this.getProps().window,
            onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                const handler = model.getActionHandler({ id: 'updateClassDocumentationImplementationNote' })
                handler({ atIndex: index, implementationNoteText: implementationNoteText })
            },
            acceptButtonLabel: `Update implementation note`,
            title: `${className} implementation note.`,
            subtitle: `You are editing an implementation note of the class ${className}.`,
        })

        dialog.open()
    }

    createClassDocumentationExample() {
        const model = this.getModel()

        const newExample = {
            Description: 'Add the example description here ...',
            Code: 'Add the example code here ...',
        }

        const className = model.getBrowsedClass().getClassName()

        const dialog = EditExampleDialog.new({
            className: className,
            example: newExample,
            window: this.getProps().window,
            onUpdateExample: model.getActionHandler({ id: 'addClassDocumentationExample' }),
            acceptButtonLabel: `Add example`,
            title: `${className} example.`,
            subtitle: `You are editing an example of the class ${className}.`,
        })

        dialog.open()
    }

    editClassDocumentationExample({ atIndex: index, example: example }) {
        const model = this.getModel()

        const className = model.getBrowsedClass().getClassName()

        const dialog = EditExampleDialog.new({
            className: className,
            example: example,
            window: this.getProps().window,
            onUpdateExample: ({ example: example }) => {
                const handler = model.getActionHandler({ id: 'updateClassDocumentationExample' })
                handler({ atIndex: index, example: example })
            },
            acceptButtonLabel: `Update example note`,
            title: `${className} example.`,
            subtitle: `You are editing an example of the class ${className}.`,
        })

        dialog.open()
    }

}

module.exports = Classification.define(ClassFormattedComment)
