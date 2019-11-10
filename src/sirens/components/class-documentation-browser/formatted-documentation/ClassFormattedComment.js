const path = require('path')
const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')

const ClassCommentHeader = require ('../ClassCommentHeader')
const PlaygroundComponent = require ('../../shared/PlaygroundComponent')
const EditClassCommentDialog = require('../edition/EditClassCommentDialog')
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

    /// Actions

    editClassComment() {
        const model = this.getModel()

        const dialog = EditClassCommentDialog.new({
            model: model,
            window: this.getProps().window,
            onUpdateClassComment: this.updateClassComment.bind(this),
            unformatted: false,
        })

        dialog.open()
    }

    updateClassComment({ newClassDescription: newClassDescription }) {
        const model = this.getModel()

        const documentation = model.getClassDocumentation()

        documentation.setDescription( newClassDescription )

        this.updateClassDocumentation({
            documentation: documentation,
        })
    }

    addNewImplementationNote() {
        const model = this.getModel()

        const className = model.getClassName()

        const dialog = EditImplementationNoteDialog.new({
            model: model,
            implementationNoteText: 'Add the new implementation note here ...',
            window: this.getProps().window,
            onUpdateImplementationNote: this.addImplementationNote.bind(this),
            acceptButtonLabel: `Add implementation note`,
            title:  `${className} implementation note.`,
            subtitle: `You are editing an implementation note of the class ${className}.`,
        })

        dialog.open()
    }

    addImplementationNote({ implementationNoteText: implementationNoteText }) {
        const model = this.getModel()

        const documentation = model.getClassDocumentation()

        documentation.addImplementationNote( implementationNoteText )

        this.updateClassDocumentation({
            documentation: documentation,
        })
    }

    deleteImplementationNote({ atIndex: index }) {
        const model = this.getModel()

        const documentation = model.getClassDocumentation()

        documentation.deleteImplementationNoteAt({ index: index })

        this.updateClassDocumentation({
            documentation: documentation,
        })
    }


    editImplementationNoteAt({ index: index, implementationNoteText: implementationNoteText }) {
        const model = this.getModel()

        const className = model.getClassName()

        const dialog = EditImplementationNoteDialog.new({
            model: model,
            implementationNoteText: implementationNoteText,
            window: this.getProps().window,
            onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                this.updateImplementationNoteAt({
                    index: index,
                    implementationNoteText: implementationNoteText,
                })
            },
            acceptButtonLabel: `Update implementation note`,
            title:  `${className} implementation note.`,
            subtitle: `You are editing an implementation note of the class ${className}.`,
        })

        dialog.open()
    }

    updateImplementationNoteAt({ index: index, implementationNoteText: implementationNoteText }) {
        const model = this.getModel()

        const documentation = model.getClassDocumentation()

        documentation.updateImplementationNoteAt({
            index: index,
            implementationNoteText: implementationNoteText,
        })

        this.updateClassDocumentation({
            documentation: documentation,
        })
    }

    addNewExample() {
        const model = this.getModel()

        const newExample = {
            Description: 'Add the example description here ...',
            Code: 'Add the example code here ...',
        }

        const className = model.getClassName()

        const dialog = EditExampleDialog.new({
            model: model,
            example: newExample,
            window: this.getProps().window,
            onUpdateExample: this.addExample.bind(this),
            acceptButtonLabel: `Add example`,
            title: `${className} example.`,
            subtitle: `You are editing an example of the class ${className}.`,
        })

        dialog.open()
    }

    addExample({ example: example }) {
        const model = this.getModel()

        const documentation = model.getClassDocumentation()

        documentation.addExample( example )

        this.updateClassDocumentation({
            documentation: documentation,
        })
    }

    editExampleAt({ index: index, example: example }) {
        const model = this.getModel()

        const className = model.getClassName()

        const dialog = EditExampleDialog.new({
            model: model,
            example: example,
            window: this.getProps().window,
            onUpdateExample: ({ example: example }) => {
                this.updateExampleAt({
                    index: index,
                    example: example,
                })
            },
            acceptButtonLabel: `Update example note`,
            title: `${className} example.`,
            subtitle: `You are editing an example of the class ${className}.`,
        })

        dialog.open()
    }

    updateExampleAt({ index: index, example: example }) {
        const model = this.getModel()

        const documentation = model.getClassDocumentation()

        documentation.updateExampleAt({
            index: index,
            example: example,
        })

        this.updateClassDocumentation({
            documentation: documentation,
        })
    }

    deleteExample({ atIndex: index }) {
        const model = this.getModel()

        const documentation = model.getClassDocumentation()

        documentation.deleteExampleAt({ index: index })

        this.updateClassDocumentation({
            documentation: documentation,
        })
    }



    updateClassDocumentation({ documentation: documentation }) {
        const classCommentContents = documentation.generateCommentContents()

        const model = this.getModel()

        const classDefinition = model.getClassDefinition()

        const classComment = classDefinition.getComment()

        classComment.writeFormattedContents({ commentContents: classCommentContents })

        model.reload()
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const className = model.getClassName()

        const isInEditionMode = model.isInEditionMode()

        const editionClosure = isInEditionMode ?
            this.editClassComment.bind(this) : undefined

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
                            className: className,
                            window: this.getProps().window,
                        })
                    )

                    this.component(
                        PlaygroundComponent.new({
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
                                addNewImplementationNote: component.addNewImplementationNote.bind(component),
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
                                deleteImplementationNote: component.deleteImplementationNote.bind(component),
                                editImplementationNote: ({ atIndex: index }) => {
                                    component.editImplementationNoteAt({
                                        index: index,
                                        implementationNoteText: implementationNote,
                                    })
                                },
                            })
                        )
                    })

                    if( isInEditionMode ) {
                        this.component(
                            ExamplesEditionHeader.new({
                                model: model,
                                addNewExample: component.addNewExample.bind(component),
                            })
                        )

                        this.verticalSeparator()
                    }

                    examples.forEach( (example) => {
                        this.verticalSeparator()

                        this.component(
                            ExampleDocumentation.new({
                                model: model,
                                example: example,
                                deleteExample: component.deleteExample.bind(component),
                                editExample: ({ atIndex: index }) => {
                                    component.editExampleAt({
                                        index: index,
                                        example: example,
                                    })
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
