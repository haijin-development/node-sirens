const Sirens = require('../../../Sirens')
const EditClassCommentDialog = require('../../components/class-documentation-browser/edition/EditClassCommentDialog')
const EditImplementationNoteDialog = require('../../components/class-documentation-browser/edition/EditImplementationNoteDialog')
const EditExampleDialog = require('../../components/class-documentation-browser/edition/EditExampleDialog')

function guiClassDocumentationCommands(thisFlow) {

    this.category( 'commands that make use of the GUI components.', () => {

        this.command({
            id: 'editClassDocumentationComment',
            whenActioned: ({ parentWindow: parentWindow }) => {
                const className = thisFlow.getBrowsedClass().getClassName()

                const classDocumentation = thisFlow.getFlowPoint({ id: 'classDocumentation' }).getValue()

                let classComment = classDocumentation.getDescription()

                if( classComment.trim() === '' ) {
                    classComment = 'This class has no documentation yet.'
                }

                const dialog = EditClassCommentDialog.new({
                    className: className,
                    classComment: classComment,
                    window: parentWindow,
                    onUpdateClassComment: ({ newClassDescription: newClassDescription }) => {
                        thisFlow.executeCommand({
                            id: 'updateClassDocumentationComment',
                            with: { newClassDescription: newClassDescription }
                        })
                    },
                })

                dialog.open()
            }
        })

        this.command({
            id: 'createClassDocumentationImplementationNote',
            whenActioned: ({ parentWindow: parentWindow }) => {
                const className = thisFlow.getBrowsedClass().getClassName()

                const dialog = EditImplementationNoteDialog.new({
                    className: className,
                    implementationNoteText: 'Add the new implementation note here ...',
                    window: parentWindow,
                    onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                        thisFlow.executeCommand({
                            id: 'addClassDocumentationImplementationNote',
                            with: { implementationNoteText: implementationNoteText },
                        })
                    },
                    acceptButtonLabel: `Add implementation note`,
                    title: `${className} implementation note.`,
                    subtitle: `You are editing an implementation note of the class ${className}.`,
                })

                dialog.open()
            }
        })

        this.command({
            id: 'editClassDocumentationImplementationNote',
            whenActioned: ({ parentWindow: parentWindow, atIndex: index, implementationNoteText: implementationNoteText }) => {
                const className = thisFlow.getBrowsedClass().getClassName()

                const dialog = EditImplementationNoteDialog.new({
                    className: className,
                    implementationNoteText: implementationNoteText,
                    window: parentWindow,
                    onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                        thisFlow.executeCommand({
                            id: 'updateClassDocumentationImplementationNote',
                            with: { 
                                atIndex: index,
                                implementationNoteText: implementationNoteText,
                            },
                        })
                    },
                    acceptButtonLabel: `Update implementation note`,
                    title: `${className} implementation note.`,
                    subtitle: `You are editing an implementation note of the class ${className}.`,
                })

                dialog.open()
            }
        })

        this.command({
            id: 'createClassDocumentationExample',
            whenActioned: ({ parentWindow: parentWindow }) => {
                const newExample = {
                    Description: 'Add the example description here ...',
                    Code: 'Add the example code here ...',
                }

                const className = thisFlow.getBrowsedClass().getClassName()

                const dialog = EditExampleDialog.new({
                    className: className,
                    example: newExample,
                    window: parentWindow,
                    onUpdateExample: ({ example: example }) => {
                        thisFlow.executeCommand({
                            id: 'addClassDocumentationExample',
                            with: { example: example },
                        })
                    },
                    acceptButtonLabel: `Add example`,
                    title: `${className} example.`,
                    subtitle: `You are editing an example of the class ${className}.`,
                })

                dialog.open()
            }
        })

        this.command({
            id: 'editClassDocumentationExample',
            enabledIf: () => { thisFlow.isEditingAClass() },
            whenActioned: ({ parentWindow: parentWindow, atIndex: index, example: example }) => {
                const className = thisFlow.getBrowsedClass().getClassName()

                const dialog = EditExampleDialog.new({
                    className: className,
                    example: example,
                    window: parentWindow,
                    onUpdateExample: ({ example: example }) => {
                        thisFlow.executeCommand({
                            id: 'updateClassDocumentationExample',
                            with: {
                                atIndex: index,
                                example: example,
                            }
                        })
                    },
                    acceptButtonLabel: `Update example note`,
                    title: `${className} example.`,
                    subtitle: `You are editing an example of the class ${className}.`,
                })

                dialog.open()
            }
        })

        this.command({
            id: 'editClassUnformattedComment',
            whenActioned: ({ parentWindow: parentWindow }) => {
                const classDefinition = thisFlow.getBrowsedClass()

                const className = classDefinition.getClassName()

                const classComment = classDefinition.getComment().getSourceCode()

                const dialog = EditClassCommentDialog.new({
                    className: className,
                    classComment: classComment,
                    window: parentWindow,
                    onUpdateClassComment: ({ newClassDescription: newClassDescription }) => {
                        thisFlow.executeCommand({
                            id: 'updateClassUnformattedComment',
                            with: { newClassDescription: newClassDescription },
                        })   
                    },
                })

                dialog.open()
            }
        })

    })
}

module.exports = {
    guiClassDocumentationCommands: guiClassDocumentationCommands,
}