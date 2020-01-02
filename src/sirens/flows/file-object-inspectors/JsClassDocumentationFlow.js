const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/stateful-flows/ValueFlow')
const EditImplementationNoteDialog = require('../../components/documentation-browser/edition/EditImplementationNoteDialog')
const EditExampleDialog = require('../../components/documentation-browser/edition/EditExampleDialog')

const DocumentationExampleComponent = require('../../components/documentation-browser/examples/DocumentationExampleComponent')
const DocumentationExample = require('../../objects/documentation/sections/DocumentationExample')

const DocumentationImplementationNoteComponent = require('../../components/documentation-browser/implementation-notes/DocumentationImplementationNoteComponent')
const DocumentationImplementationNote = require('../../objects/documentation/sections/DocumentationImplementationNote')

const DocumentationIndexSection = require('./DocumentationIndexSection')

class JsClassDocumentationFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineMethodsAsCommands({
                methods: [
                    'getClassDocumentation',
                    'getClassName',
                    'getClassDescription',
                    'getClassImplementationNotes',
                    'getClassExamples',
                    'getSelectedDocumentationItemFlowPoint',
                    'getSelectedDocumentationItemComponent',
                    'isInEditionMode',
                    'editClassDocumentationDescription',
                    'createClassDocumentationImplementationNote',
                    'editClassDocumentationImplementationNote',
                    'deleteClassDocumentationImplementationNote',
                    'createClassDocumentationExample',
                    'editClassDocumentationExample',
                    'deleteClassDocumentationExample',
                ],
            })

            this.whenObjectChanges( function({ newValue: classDocumentation }) {
                const documentationIndex = this.getChildFlow({ id: 'documentationIndex' })

                const roots = classDocumentation ?
                    thisFlow.getDocumentIndexSections()
                    :
                    []

                documentationIndex.setRoots({ items: roots })
            })

            this.treeChoice({
                id: 'documentationIndex',
                roots: [],
                getChildrenClosure: function (indexSection) {
                    return indexSection.respondsTo( 'getItems' ) ?
                        indexSection.getItems()
                        :
                        []
                },
                whenSelectionChanges: function({ newValue: pathToIndexSection }) {
                    const documentationItem = pathToIndexSection.length > 0 ?
                        pathToIndexSection[ pathToIndexSection.length - 1 ]
                        :
                        null

                    const selectedItemFlow = thisFlow.getChildFlow({
                        id: 'selectedDocumentationItem'
                    })

                    selectedItemFlow.setValue( documentationItem )
                },
            }, function() {

                this.value({ id: 'selectedDocumentationItem' })

            })

        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'getClassDocumentation',
            'getClassName',
            'getClassDescription',
            'getClassImplementationNotes',
            'getClassExamples',
            'getSelectedDocumentationItemFlowPoint',
            'getSelectedDocumentationItemComponent',
            'isInEditionMode',
            'editClassDocumentationDescription',
            'createClassDocumentationImplementationNote',
            'editClassDocumentationImplementationNote',
            'deleteClassDocumentationImplementationNote',
            'createClassDocumentationExample',
            'editClassDocumentationExample',
            'deleteClassDocumentationExample',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    getDocumentIndexSections() {
        return [
            DocumentationIndexSection.new({
                label: 'Implementation notes',
                items: this.getClassImplementationNotes(),
            }),
            DocumentationIndexSection.new({
                label: 'Examples',
                items: this.getClassExamples(),
            }),
        ]
    }

    // Commands

    getClassDocumentation() {
        return this.getValue()
    }

    getClassName() {
        return this.getClassDocumentation().getClassName()
    }

    getClassDescription() {
        return this.getClassDocumentation().getDescription()
    }

    getClassImplementationNotes() {
        return this.getClassDocumentation().getImplementationNotes()
    }

    getClassExamples() {
        return this.getClassDocumentation().getExamples()
    }

    getSelectedDocumentationItemFlowPoint() {
        const flowPoint = this.getChildFlow({ id: 'selectedDocumentationItem' }).asFlowPoint()

        this.exportCommandsToFlowPoint({
            commandsIds: [ 'isInEditionMode' ],
            flowPoint: flowPoint
        })

        return flowPoint
    }

    getSelectedDocumentationItemComponent() {
        const selectedItemFlow = this.getSelectedDocumentationItemFlowPoint()

        const selectedItem = selectedItemFlow.getValue()

        if( ! selectedItem ) { return null }

        if( selectedItem.isBehavingAs(DocumentationExample) ) {
            return DocumentationExampleComponent.new({
                model: this.getSelectedDocumentationItemFlowPoint()
            })

        }

        if( selectedItem.isBehavingAs(DocumentationImplementationNote) ) {
            return DocumentationImplementationNoteComponent.new({
                model: this.getSelectedDocumentationItemFlowPoint()
            })

        }

        return null
    }

    isInEditionMode() {
        return this.bubbleUp({
            command: 'isEditingDocumentation',
        })
    }

    editClassDocumentationDescription({ parentWindow: parentWindow }) {
        const classDocumentation = this.getClassDocumentation()

        const dialog = this.guiNamespace().EditClassDescriptionDialog.new({
            classDocumentation: classDocumentation,
            window: parentWindow,
            onUpdateClassDescription: ({ classNewDescription: descriptionText }) => {
                this.updateClassDocumentationDescription({ classNewDescription: descriptionText })
            },
        })

        dialog.open()
    }

    updateClassDocumentationDescription({ classNewDescription: descriptionText }) {
        const classDocumentation = this.getClassDocumentation()

        classDocumentation.setDescriptionFrom({ text: descriptionText })

        this.updateClassDocumentation({
            classDocumentation: classDocumentation,
        })
    }

    createClassDocumentationImplementationNote({ parentWindow: parentWindow }) {
        const className = this.getClassDocumentation().getClassName()

        const dialog = this.guiNamespace().EditImplementationNoteDialog.new({
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

        classDocumentation.addImplementationNoteFrom({ text: implementationNoteText })

        this.updateClassDocumentation({
            classDocumentation: classDocumentation,
        })
    }

    editClassDocumentationImplementationNote({ parentWindow: parentWindow, implementationNote: implementationNote }) {
        const implementationNoteText = implementationNote.getText()

        const className = this.getClassDocumentation().getClassName()

        const dialog = this.guiNamespace().EditImplementationNoteDialog.new({
            className: className,
            implementationNoteText: implementationNoteText,
            window: parentWindow,
            onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                this.updateClassDocumentationImplementationNote({ 
                    implementationNote: implementationNote,
                    implementationNoteText: implementationNoteText,
                })
            },
            acceptButtonLabel: `Update implementation note`,
            title: `${className} implementation note.`,
            subtitle: `You are editing an implementation note of the class ${className}.`,
        })

        dialog.open()
    }

    updateClassDocumentationImplementationNote({ implementationNote: implementationNote, implementationNoteText: implementationNoteNewText }) {
        const classDocumentation = this.getClassDocumentation()

        classDocumentation.updateImplementationNote({
            implementationNote: implementationNote,
            implementationNoteText: implementationNoteNewText
        })

        this.updateClassDocumentation({
            classDocumentation: classDocumentation,
        })
    }

    deleteClassDocumentationImplementationNote({ implementationNote: implementationNote }) {
        const classDocumentation = this.getClassDocumentation()

        classDocumentation.deleteImplementationNote({
            implementationNote: implementationNote,
        })

        this.updateClassDocumentation({
            classDocumentation: classDocumentation,
        })
    }

    createClassDocumentationExample({ parentWindow: parentWindow }) {
        const className = this.getClassDocumentation().getClassName()

        const newExample = DocumentationExample.new({
            description: 'Add the example description here ...',
            code: 'Add the example code here ...',
        })

        const dialog = this.guiNamespace().EditExampleDialog.new({
            className: className,
            example: newExample,
            window: parentWindow,
            onUpdateExample: ({ description: description, code: code }) => {
                this.addClassDocumentationExample({ description: description, code: code })
            },
            acceptButtonLabel: `Add example`,
            title: `${className} example.`,
            subtitle: `You are editing an example of the class ${className}.`,
        })

        dialog.open()
    }

    addClassDocumentationExample({ description: description, code: code }) {
        const classDocumentation = this.getClassDocumentation()

        classDocumentation.addExampleFrom({ description: description, code: code })

        this.updateClassDocumentation({
            classDocumentation: classDocumentation,
        })
    }

    editClassDocumentationExample({ parentWindow: parentWindow, example: example }) {
        const className = this.getClassDocumentation().getClassName()

        const dialog = this.guiNamespace().EditExampleDialog.new({
            className: className,
            example: example,
            window: parentWindow,
            onUpdateExample: ({ description: description, code: code }) => {
                this.updateClassDocumentationExample({
                    example: example,
                    description: description,
                    code: code,
                })
            },
            acceptButtonLabel: `Update example note`,
            title: `${className} example.`,
            subtitle: `You are editing an example of the class ${className}.`,
        })

        dialog.open()
    }

    updateClassDocumentationExample({ example: example, description: description, code: code }) {
        const classDocumentation = this.getClassDocumentation()

        classDocumentation.updateExample({
            example: example,
            description: description,
            code: code,
        })

        this.updateClassDocumentation({
            classDocumentation: classDocumentation,
        })
    }

    deleteClassDocumentationExample({ example: example }) {
        const classDocumentation = this.getClassDocumentation()

        classDocumentation.deleteExample({
            example: example,
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

    guiNamespace() {
        return this.bubbleUp({
            command: 'guiNamespace',
        })
    }
}

module.exports = Classification.define(JsClassDocumentationFlow)
