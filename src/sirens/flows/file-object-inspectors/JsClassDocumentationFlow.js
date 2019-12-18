const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const EditClassDescriptionDialog = require('../../components/documentation-browser/edition/EditClassDescriptionDialog')
const EditImplementationNoteDialog = require('../../components/documentation-browser/edition/EditImplementationNoteDialog')
const EditExampleDialog = require('../../components/documentation-browser/edition/EditExampleDialog')

class JsClassDocumentationFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    defaultValue() {
        return {
            classDocumentation: null,
            isEditingDocumentation: false,
        }
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })

        })
    }

    flowCommands(thisFlow) {
        this.commandsGroup({ id: 'flow-commands' }, function() {

            this.statelessCommands({
                definedInFlow: thisFlow,
                withMethods: [
                    'getClassDocumentation',
                    'isInEditionMode',
                    'editClassDocumentationDescription',
                    'createClassDocumentationImplementationNote',
                    'editClassDocumentationImplementationNote',
                    'createClassDocumentationExample',
                    'editClassDocumentationExample',
                ],
            })

        })

    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'flow-commands.getClassDocumentation',
            'flow-commands.isInEditionMode',
            'flow-commands.editClassDocumentationDescription',
            'flow-commands.createClassDocumentationImplementationNote',
            'flow-commands.editClassDocumentationImplementationNote',
            'flow-commands.createClassDocumentationExample',
            'flow-commands.editClassDocumentationExample',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    // Commands

    getClassDocumentation() {
        return this.getValue().classDocumentation
    }

    isInEditionMode() {
        return this.getValue().isEditingDocumentation
    }

    editClassDocumentationDescription({ parentWindow: parentWindow }) {
        const classDocumentation = this.getClassDocumentation()

        const dialog = EditClassDescriptionDialog.new({
            classDocumentation: classDocumentation,
            window: parentWindow,
            onUpdateClassDescription: ({ classNewDescription: classNewDescription }) => {
                this.updateClassDocumentationDescription({ classNewDescription: classNewDescription })
            },
        })

        dialog.open()
    }

    updateClassDocumentationDescription({ classNewDescription: classNewDescription }) {
        const classDocumentation = this.getClassDocumentation()

        classDocumentation.setDescription( classNewDescription )

        this.updateClassDocumentation({
            classDocumentation: classDocumentation,
        })
    }

    createClassDocumentationImplementationNote({ parentWindow: parentWindow }) {
        const className = this.getClassDocumentation().getClassName()

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

    addClassDocumentationImplementationNote({ implementationNoteText: implementationNoteText }) {
        const classDocumentation = this.getClassDocumentation()

        classDocumentation.addImplementationNote( implementationNoteText )

        this.updateClassDocumentation({
            classDocumentation: classDocumentation,
        })
    }

    editClassDocumentationImplementationNote({ parentWindow: parentWindow, atIndex: index, implementationNoteText: implementationNoteText }) {
        const className = this.getClassDocumentation().getClassName()

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

    updateClassDocumentationImplementationNote({ atIndex: index, implementationNoteText: implementationNoteText }) {
        const classDocumentation = this.getClassDocumentation()

        classDocumentation.updateImplementationNoteAt({ index: index, implementationNoteText: implementationNoteText})

        this.updateClassDocumentation({
            classDocumentation: classDocumentation,
        })
    }

    createClassDocumentationExample({ parentWindow: parentWindow }) {
        const className = this.getClassDocumentation().getClassName()

        const newExample = {
            Description: 'Add the example description here ...',
            Code: 'Add the example code here ...',
        }

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

    addClassDocumentationExample({ example: example }) {
        const classDocumentation = this.getClassDocumentation()

        classDocumentation.addExample( example )

        this.updateClassDocumentation({
            classDocumentation: classDocumentation,
        })
    }

    editClassDocumentationExample({ parentWindow: parentWindow, example: example }) {
        const className = this.getClassDocumentation().getClassName()

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

    updateClassDocumentationExample({ atIndex: index, example: example }) {
        const classDocumentation = this.getClassDocumentation()

        classDocumentation.updateExampleAt({
            index: index,
            example: example
        })

        this.updateClassDocumentation({
            classDocumentation: classDocumentation,
        })
    }

    updateClassDocumentation({ classDocumentation: classDocumentation }) {
        this.bubbleUp({
            command: 'updateClassDocumentation',
            param: { classDocumentation: classDocumentation },
        })
    }
}

module.exports = Classification.define(JsClassDocumentationFlow)
