const Classification = require('../../../O').Classification
const Sirens = require('../../../Sirens')
const EditClassCommentDialog = require('../../components/class-documentation-browser/edition/EditClassCommentDialog')
const EditImplementationNoteDialog = require('../../components/class-documentation-browser/edition/EditImplementationNoteDialog')
const EditExampleDialog = require('../../components/class-documentation-browser/edition/EditExampleDialog')

class GuiClassDocumentationCommands {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }

    flowCommands({ flowBuilder: flowBuilder, thisFlow: thisFlow }) {

        this.previousClassificationDo( () => {
            this.flowCommands({ flowBuilder: flowBuilder, thisFlow: thisFlow })
        })

        flowBuilder.commandsGroup({ id: 'gui-class-documentation-commands' }, function() {

            this.command({
                id: 'editClassDocumentationComment',
                whenActioned: thisFlow.editClassDocumentationComment.bind(thisFlow),
            })

            this.command({
                id: 'createClassDocumentationImplementationNote',
                whenActioned: thisFlow.createClassDocumentationImplementationNote.bind(thisFlow),
            })

            this.command({
                id: 'editClassDocumentationImplementationNote',
                whenActioned: thisFlow.editClassDocumentationImplementationNote.bind(thisFlow),
            })

            this.command({
                id: 'createClassDocumentationExample',
                whenActioned: thisFlow.createClassDocumentationExample.bind(thisFlow),
            })

            this.command({
                id: 'editClassDocumentationExample',
                enabledIf: () => { thisFlow.isEditingAClass() },
                whenActioned: thisFlow.editClassDocumentationExample.bind(thisFlow),
            })

            this.command({
                id: 'editClassUnformattedComment',
                whenActioned: thisFlow.editClassUnformattedComment.bind(thisFlow),
            })

        })
    }

    editClassDocumentationComment({ parentWindow: parentWindow }) {
        const className = this.getBrowsedClass().getClassName()

        const classDocumentation = this.getClassDocumentation()

        let classComment = classDocumentation.getDescription()

        if( classComment.trim() === '' ) {
            classComment = 'This class has no documentation yet.'
        }

        const dialog = EditClassCommentDialog.new({
            className: className,
            classComment: classComment,
            window: parentWindow,
            onUpdateClassComment: ({ newClassDescription: newClassDescription }) => {
                this.updateClassDocumentationComment({
                    newClassDescription: newClassDescription
                })
            },
        })

        dialog.open()
    }

    createClassDocumentationImplementationNote({ parentWindow: parentWindow }) {
        const className = this.getBrowsedClass().getClassName()

        const dialog = EditImplementationNoteDialog.new({
            className: className,
            implementationNoteText: 'Add the new implementation note here ...',
            window: parentWindow,
            onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                this.addClassDocumentationImplementationNote({
                    implementationNoteText: implementationNoteText,
                })
            },
            acceptButtonLabel: `Add implementation note`,
            title: `${className} implementation note.`,
            subtitle: `You are editing an implementation note of the class ${className}.`,
        })

        dialog.open()
    }

    editClassDocumentationImplementationNote({ parentWindow: parentWindow, atIndex: index, implementationNoteText: implementationNoteText }) {
        const className = this.getBrowsedClass().getClassName()

        const dialog = EditImplementationNoteDialog.new({
            className: className,
            implementationNoteText: implementationNoteText,
            window: parentWindow,
            onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                this.updateClassDocumentationImplementationNote({ 
                    atIndex: index,
                    implementationNoteText: implementationNoteText,
                })
            },
            acceptButtonLabel: `Update implementation note`,
            title: `${className} implementation note.`,
            subtitle: `You are editing an implementation note of the class ${className}.`,
        })

        dialog.open()
    }

    createClassDocumentationExample({ parentWindow: parentWindow }) {
        const newExample = {
            Description: 'Add the example description here ...',
            Code: 'Add the example code here ...',
        }

        const className = this.getBrowsedClass().getClassName()

        const dialog = EditExampleDialog.new({
            className: className,
            example: newExample,
            window: parentWindow,
            onUpdateExample: ({ example: example }) => {
                this.addClassDocumentationExample({ example: example })
            },
            acceptButtonLabel: `Add example`,
            title: `${className} example.`,
            subtitle: `You are editing an example of the class ${className}.`,
        })

        dialog.open()
    }

    editClassDocumentationExample({ parentWindow: parentWindow, atIndex: index, example: example }) {
        const className = this.getBrowsedClass().getClassName()

        const dialog = EditExampleDialog.new({
            className: className,
            example: example,
            window: parentWindow,
            onUpdateExample: ({ example: example }) => {
                this.updateClassDocumentationExample({
                    atIndex: index,
                    example: example,
                })
            },
            acceptButtonLabel: `Update example note`,
            title: `${className} example.`,
            subtitle: `You are editing an example of the class ${className}.`,
        })

        dialog.open()
    }

    editClassUnformattedComment({ parentWindow: parentWindow }) {
        const classDefinition = this.getBrowsedClass()

        const className = classDefinition.getClassName()

        const classComment = classDefinition.getClassComment().getContents()

        const dialog = EditClassCommentDialog.new({
            className: className,
            classComment: classComment,
            window: parentWindow,
            onUpdateClassComment: ({ newClassDescription: newClassDescription }) => {
                this.updateClassUnformattedComment({
                    newClassDescription: newClassDescription
                })   
            },
        })

        dialog.open()
    }
}

module.exports = Classification.define(GuiClassDocumentationCommands)