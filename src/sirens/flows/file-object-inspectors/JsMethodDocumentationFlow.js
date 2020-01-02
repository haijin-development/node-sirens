const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/stateful-flows/ValueFlow')

const DocumentationExampleComponent = require('../../components/documentation-browser/examples/DocumentationExampleComponent')
const DocumentationExample = require('../../objects/documentation/sections/DocumentationExample')

const DocumentationParamComponent = require('../../components/documentation-browser/params/DocumentationParamComponent')
const DocumentationParam = require('../../objects/documentation/sections/DocumentationParam')

const DocumentationImplementationNoteComponent = require('../../components/documentation-browser/implementation-notes/DocumentationImplementationNoteComponent')
const DocumentationImplementationNote = require('../../objects/documentation/sections/DocumentationImplementationNote')

const DocumentationReturnValueComponent = require('../../components/documentation-browser/params/DocumentationReturnValueComponent')
const DocumentationReturnValue = require('../../objects/documentation/sections/DocumentationReturnValue')

const DocumentationIndexSection = require('./DocumentationIndexSection')

class JsMethodDocumentationFlow {
    /// Definition

    static definition() {
        this.instanceVariables = ['updateMethodDocumentationClosure']
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineMethodsAsCommands({
                methods: [
                    'getMethodDocumentation',
                    'getMethodSignature',
                    'getMethodDescription',
                    'getMethodImplementationNotes',
                    'getMethodParams',
                    'getMethodReturnValue',
                    'getMethodExamples',
                    'getSelectedDocumentationItemFlowPoint',
                    'getSelectedDocumentationItemComponent',
                    'getTagsSortedByPriority',
                    'isInEditionMode',
                    'editMethodTags',
                    'editMethodDocumentationDescription',
                    'createMethodDocumentationImplementationNote',
                    'editMethodDocumentationImplementationNote',
                    'deleteMethodDocumentationImplementationNote',
                    'createMethodDocumentationExample',
                    'editMethodDocumentationExample',
                    'deleteMethodDocumentationExample',
                    'createMethodDocumentationParam',
                    'editMethodDocumentationParam',
                    'deleteMethodDocumentationParam',
                    'editMethodDocumentationReturnValue',
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

    getDocumentIndexSections() {
        return [
            DocumentationIndexSection.new({
                label: 'Implementation notes',
                items: this.getMethodImplementationNotes(),
            }),
            DocumentationIndexSection.new({
                label: 'Parameters',
                items: this.getMethodParams(),
            }),
            this.getMethodReturnValue(),
            DocumentationIndexSection.new({
                label: 'Examples',
                items: this.getMethodExamples(),
            }),
        ]
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'getMethodDocumentation',
            'getMethodSignature',
            'getMethodDescription',
            'getMethodImplementationNotes',
            'getMethodParams',
            'getMethodReturnValue',
            'getSelectedDocumentationItemFlowPoint',
            'getSelectedDocumentationItemComponent',
            'getTagsSortedByPriority',
            'isInEditionMode',
            'editMethodTags',
            'editMethodDocumentationDescription',
            'createMethodDocumentationImplementationNote',
            'editMethodDocumentationImplementationNote',
            'deleteMethodDocumentationImplementationNote',
            'createMethodDocumentationExample',
            'editMethodDocumentationExample',
            'deleteMethodDocumentationExample',
            'createMethodDocumentationParam',
            'editMethodDocumentationParam',
            'deleteMethodDocumentationParam',
            'editMethodDocumentationReturnValue',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    // Commands

    getMethodDocumentation() {
        return this.getValue()
    }

    getMethodSignature() {
        return this.getMethodDocumentation().getSignatureString()
    }

    getMethodDescription() {
        return this.getMethodDocumentation().getDescription()
    }

    getMethodImplementationNotes() {
        return this.getMethodDocumentation().getImplementationNotes()
    }

    getMethodParams() {
        return this.getMethodDocumentation().getParams()
    }

    getMethodReturnValue() {
        return this.getMethodDocumentation().getReturnValue()
    }

    getMethodExamples() {
        return this.getMethodDocumentation().getExamples()
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

        const selectionFlow = this.getSelectedDocumentationItemFlowPoint()

        if( selectedItem.isBehavingAs(DocumentationExample) ) {
            return DocumentationExampleComponent.new({
                model: selectionFlow
            })

        }

        if( selectedItem.isBehavingAs(DocumentationParam) ) {
            return DocumentationParamComponent.new({
                model: selectionFlow
            })

        }

        if( selectedItem.isBehavingAs(DocumentationReturnValue) ) {
            return DocumentationReturnValueComponent.new({
                model: selectionFlow
            })

        }

        if( selectedItem.isBehavingAs(DocumentationImplementationNote) ) {
            return DocumentationImplementationNoteComponent.new({
                model: selectionFlow
            })

        }

        return null
    }

    getTagsSortedByPriority() {
        const allTags = this.getMethodDocumentation().getTags()

        const tagsSortedAlphabetically = allTags.sort( (item1, item2) => {
            return item1.getLabel() < item2.getLabel()
        })

        const prioritizedTags = []

        const unprioritizedTags = tagsSortedAlphabetically.filter( (tag) => {
            const prioritizesTag = this.prioritizesTag({ tag: tag })

            if( prioritizesTag === true ) {
                prioritizedTags.push( tag )
            }

            return prioritizesTag === false
        })

        const sortedTags = prioritizedTags.concat( unprioritizedTags )

        return sortedTags
    }

    isInEditionMode() {
        return this.bubbleUp({
            command: 'isEditingDocumentation'
        })
    }

    editMethodTags({ parentWindow: parentWindow }) {
        const methodDocumentation = this.getMethodDocumentation()

        const tags = methodDocumentation.getTags()

        const dialog = this.guiNamespace().EditTagsDialog.new({
            methodDocumentation: methodDocumentation,
            tags: tags,
            window: parentWindow,
            onUpdateTags: ({ newTags: newTags }) => {
                this.updateMethodDocumentationTags({ newTags: newTags })
            },
            acceptButtonLabel: 'Update method tags',
        })

        dialog.open()
    }

    updateMethodDocumentationTags({ newTags: newTags }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.setTagsFrom({ tagsStrings: newTags })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    editMethodDocumentationDescription({ parentWindow: parentWindow }) {
        const methodDocumentation = this.getMethodDocumentation()

        const dialog = this.guiNamespace().EditMethodDescriptionDialog.new({
            methodDocumentation: methodDocumentation,
            window: parentWindow,
            onUpdateMethodComment: ({ methodNewDescription: descriptionText }) => {
                this.updateMethodDocumentationDescription({ methodNewDescription: descriptionText })
            },
            unformatted: false,
        })

        dialog.open()
    }

    updateMethodDocumentationDescription({ methodNewDescription: descriptionText }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.setDescriptionFrom({ text: descriptionText })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    createMethodDocumentationParam({ parentWindow: parentWindow }) {
        const methodDocumentation = this.getMethodDocumentation()

        const newParam = DocumentationParam.new({
            name: 'Add the name of the parameter here ...',
            description: 'Add the parameter description ...',
        })

        const dialog = this.guiNamespace().EditParamDialog.new({
            methodDocumentation: methodDocumentation,
            param: newParam,
            window: parentWindow,
            onUpdateParam: ({ name: name, description: description }) => {
                this.addMethodDocumentationParamFrom({ name: name, description: description })
            },
            acceptButtonLabel: `Add param`,
        })

        dialog.open()
    }

    addMethodDocumentationParamFrom({ name: name, description: description }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.addParamFrom({ name: name, description: description })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    editMethodDocumentationParam({ parentWindow: parentWindow, param: param, paramIndex: paramIndex }) {
        const methodDocumentation = this.getMethodDocumentation()

        const dialog = this.guiNamespace().EditParamDialog.new({
            methodDocumentation: methodDocumentation,
            param: param,
            window: parentWindow,
            onUpdateParam: ({ name: name, description: description }) => {
                this.updateMethodDocumentationParam({
                    param: param,
                    name: name,
                    description: description,
                })
            },
            acceptButtonLabel: `Update param`,
        })

        dialog.open()
    }

    updateMethodDocumentationParam({ param: param, name: name, description: description }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.updateParamFrom({
            param: param,
            name: name,
            description: description
        })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    deleteMethodDocumentationParam({ param: param }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.deleteParam({ param: param })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    editMethodDocumentationReturnValue({ parentWindow: parentWindow }) {
        const methodDocumentation = this.getMethodDocumentation()

        const dialog = this.guiNamespace().EditReturnValueDialog.new({
            methodDocumentation: methodDocumentation,
            returnValue: methodDocumentation.getReturnValue(),
            window: parentWindow,
            onUpdateReturnValue: ({ returnValueDescription: returnValueDescription }) => {
                this.updateMethodDocumentationReturnValue({ returnValueDescription: returnValueDescription })
            },
            acceptButtonLabel: `Update return value`,
        })

        dialog.open()
    }

    updateMethodDocumentationReturnValue({ returnValueDescription: returnValueDescription }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.setReturnValueFrom({ description: returnValueDescription })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    createMethodDocumentationImplementationNote({ parentWindow: parentWindow }) {
        const methodDocumentation = this.getMethodDocumentation()

        const dialog = this.guiNamespace().EditImplementationNoteDialog.new({
            methodDocumentation: methodDocumentation,
            implementationNoteText: 'Add the new implementation note here ...',
            window: parentWindow,
            onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                this.addMethodDocumentationImplementationNote({ implementationNoteText: implementationNoteText })
            },
            acceptButtonLabel: `Add implementation note`,
            title: `${methodDocumentation.getSignatureString()}`,
            subtitle: `You are editing an implementation note of the method ${methodDocumentation.getMethodName()}.`,
        })

        dialog.open()
    }

    addMethodDocumentationImplementationNote({ implementationNoteText: implementationNoteText }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.addImplementationNoteFrom({ text: implementationNoteText })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    editMethodDocumentationImplementationNote({ parentWindow: parentWindow, implementationNote: implementationNote }) {
        const implementationNoteText = implementationNote.getText()

        const methodDocumentation = this.getMethodDocumentation()

        const dialog = this.guiNamespace().EditImplementationNoteDialog.new({
            implementationNoteText: implementationNoteText,
            window: parentWindow,
            onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                const handler = this.updateMethodDocumentationImplementationNote({
                    implementationNote: implementationNote,
                    implementationNoteText: implementationNoteText
                })
            },
            acceptButtonLabel: `Update implementation note`,
            title: `${methodDocumentation.getSignatureString()}`,
            subtitle: `You are editing an implementation note of the method ${methodDocumentation.getMethodName()}.`,
        })

        dialog.open()                
    }

    updateMethodDocumentationImplementationNote({
        implementationNote: implementationNote, implementationNoteText: implementationNoteText
    }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.updateImplementationNote({
            implementationNote: implementationNote,
            implementationNoteText: implementationNoteText,
        })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    deleteMethodDocumentationImplementationNote({ implementationNote: implementationNote }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.deleteImplementationNote({ implementationNote: implementationNote })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    createMethodDocumentationExample({ parentWindow: parentWindow }) {
        const methodDocumentation = this.getMethodDocumentation()

        const newExample = DocumentationExample.new({
            description: 'Add the example description here ...',
            code: 'Add the example code here ...',
        })

        const dialog = this.guiNamespace().EditExampleDialog.new({
            methodDocumentation: methodDocumentation,
            example: newExample,
            window: parentWindow,
            onUpdateExample: ({ description: description, code: code }) => {
                this.addMethodDocumentationExample({ description: description, code: code })
            },
            acceptButtonLabel: `Add example`,
            title: `${methodDocumentation.getSignatureString()}`,
            subtitle: `You are editing an example of the method ${methodDocumentation.getMethodName()}.`,
        })

        dialog.open()
    }

    addMethodDocumentationExample({ description: description, code: code }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.addExampleFrom({ description: description, code: code })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    editMethodDocumentationExample({ parentWindow: parentWindow, atIndex: index, example: example }) {
        const methodDocumentation = this.getMethodDocumentation()

        const dialog = this.guiNamespace().EditExampleDialog.new({
            methodDocumentation: methodDocumentation,
            example: example,
            window: parentWindow,
            onUpdateExample: ({ description: description, code: code }) => {
                this.updateMethodDocumentationExample({
                    example: example, description: description, code: code,
                })
            },
            acceptButtonLabel: `Update example`,
            title: `${methodDocumentation.getSignatureString()}`,
            subtitle: `You are editing an example of the method ${methodDocumentation.getMethodName()}.`,
        })

        dialog.open()
    }

    updateMethodDocumentationExample({
        example: example, description: description, code: code
    }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.updateExample({
            example: example,
            description: description,
            code: code,
        })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    deleteMethodDocumentationExample({ example: example }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.deleteExample({
            example: example,
        })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation,
        })
    }

    updateMethodDocumentation({ methodDocumentation: methodDocumentation }) {
        this.bubbleUp({
            command: 'updateMethodDocumentation',
            param: { methodDocumentation: methodDocumentation },
        })
    }

    guiNamespace() {
        return this.bubbleUp({
            command: 'guiNamespace',
        })
    }

    prioritizesTag({ tag: tag }) {
        const preferences = this.getPreferences()

        return preferences.methodTags.prioritizedTags.includes( tag )
    }

    getPreferences() {
        return this.bubbleUp({
            command: 'getPreferences'
        })
    }
}

module.exports = Classification.define(JsMethodDocumentationFlow)
