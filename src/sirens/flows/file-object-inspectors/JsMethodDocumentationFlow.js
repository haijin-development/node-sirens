const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const EditTagsDialog = require ('../../components/documentation-browser/edition/EditTagsDialog')
const EditMethodDescriptionDialog = require('../../components/documentation-browser/edition/EditMethodDescriptionDialog')
const EditParamDialog = require ('../../components/documentation-browser/edition/EditParamDialog')
const EditReturnsDialog = require('../../components/documentation-browser/edition/EditReturnsDialog')
const EditImplementationNoteDialog = require('../../components/documentation-browser/edition/EditImplementationNoteDialog')
const EditExampleDialog = require('../../components/documentation-browser/edition/EditExampleDialog')

class JsMethodDocumentationFlow {
    /// Definition

    static definition() {
        this.instanceVariables = ['updateMethodDocumentationClosure']
        this.assumes = [ValueFlow]
    }

    defaultValue() {
        return {
            methodDocumentation: null,
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

            this.command({
                id: 'getMethodDocumentation',
                whenActioned: thisFlow.getMethodDocumentation.bind(thisFlow),
            })

            this.command({
                id: 'isInEditionMode',
                whenActioned: thisFlow.isInEditionMode.bind(thisFlow),
            })

            this.command({
                id: 'editMethodTags',
                whenActioned: thisFlow.editMethodTags.bind(thisFlow),
            })

            this.command({
                id: 'editMethodDocumentationComment',
                whenActioned: thisFlow.editMethodDocumentationComment.bind(thisFlow),
            })

            this.command({
                id: 'createMethodDocumentationImplementationNote',
                whenActioned: thisFlow.createMethodDocumentationImplementationNote.bind(thisFlow),
            })

            this.command({
                id: 'editMethodDocumentationImplementationNote',
                whenActioned: thisFlow.editMethodDocumentationImplementationNote.bind(thisFlow),
            })

            this.command({
                id: 'createMethodDocumentationExample',
                whenActioned: thisFlow.createMethodDocumentationExample.bind(thisFlow),
            })

            this.command({
                id: 'editMethodDocumentationExample',
                whenActioned: thisFlow.editMethodDocumentationExample.bind(thisFlow),
            })

            this.command({
                id: 'createMethodDocumentationParam',
                whenActioned: thisFlow.createMethodDocumentationParam.bind(thisFlow),
            })

            this.command({
                id: 'editMethodDocumentationParam',
                whenActioned: thisFlow.editMethodDocumentationParam.bind(thisFlow),
            })

            this.command({
                id: 'editMethodDocumentationReturn',
                whenActioned: thisFlow.editMethodDocumentationReturn.bind(thisFlow),
            })

        })

    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'flow-commands.getMethodDocumentation',
            'flow-commands.isInEditionMode',
            'flow-commands.editMethodTags',
            'flow-commands.editMethodDocumentationComment',
            'flow-commands.createMethodDocumentationImplementationNote',
            'flow-commands.editMethodDocumentationImplementationNote',
            'flow-commands.createMethodDocumentationExample',
            'flow-commands.editMethodDocumentationExample',
            'flow-commands.createMethodDocumentationParam',
            'flow-commands.editMethodDocumentationParam',
            'flow-commands.editMethodDocumentationReturn',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    // Commands

    getMethodDocumentation() {
        return this.getValue().methodDocumentation
    }

    isInEditionMode() {
        return this.getValue().isEditingDocumentation
    }

    editMethodTags({ parentWindow: parentWindow }) {
        const methodDocumentation = this.getMethodDocumentation()

        const tags = methodDocumentation.getTags()

        const dialog = EditTagsDialog.new({
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

        methodDocumentation.setTags( newTags )

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    editMethodDocumentationComment({ parentWindow: parentWindow }) {
        const methodDocumentation = this.getMethodDocumentation()

        const dialog = EditMethodDescriptionDialog.new({
            methodDocumentation: methodDocumentation,
            window: parentWindow,
            onUpdateMethodComment: ({ methodNewDescription: methodNewDescription }) => {
                this.updateMethodDocumentationDescription({ methodNewDescription: methodNewDescription })
            },
            unformatted: false,
        })

        dialog.open()
    }

    updateMethodDocumentationDescription({ methodNewDescription: methodNewDescription }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.setDescription( methodNewDescription )

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    createMethodDocumentationParam({ parentWindow: parentWindow }) {
        const methodDocumentation = this.getMethodDocumentation()

        const newParam = {
            Name: 'Add the name of the parameter here ...',
            Description: 'Add the parameter description ...',
        }
        const dialog = EditParamDialog.new({
            methodDocumentation: methodDocumentation,
            param: newParam,
            window: parentWindow,
            onUpdateParam: ({ param: param }) => {
                this.addMethodDocumentationParam({ param: param })
            },
            acceptButtonLabel: `Add param`,
        })

        dialog.open()
    }

    addMethodDocumentationParam({ param: param }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.addParam( param )

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    editMethodDocumentationParam({ parentWindow: parentWindow, param: param, paramIndex: paramIndex }) {
        const methodDocumentation = this.getMethodDocumentation()

        const dialog = EditParamDialog.new({
            methodDocumentation: methodDocumentation,
            param: param,
            window: parentWindow,
            onUpdateParam: ({ param: newParam }) => {
                const actionHandler = this.updateMethodDocumentationParam({
                    atIndex: paramIndex,
                    newParam: newParam
                })
            },
            acceptButtonLabel: `Update param`,
        })

        dialog.open()
    }

    updateMethodDocumentationParam({ atIndex: paramIndex, newParam: newParam }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.updateParamAt({ index: paramIndex, param: newParam })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    editMethodDocumentationReturn({ parentWindow: parentWindow }) {
        const methodDocumentation = this.getMethodDocumentation()

        const dialog = EditReturnsDialog.new({
            methodDocumentation: methodDocumentation,
            returns: methodDocumentation.getReturns(),
            window: parentWindow,
            onUpdateReturns: ({ returns: returns }) => {
                this.updateMethodDocumentationReturn({ returns: returns })
            },
            acceptButtonLabel: `Update returns`,
        })

        dialog.open()
    }

    updateMethodDocumentationReturn({ returns: returns }) {
        const methodDocumentation = this.getMethodDocumentation()

        documentation.setReturns( returns )

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    createMethodDocumentationImplementationNote({ parentWindow: parentWindow }) {
        const methodDocumentation = this.getMethodDocumentation()

        const dialog = EditImplementationNoteDialog.new({
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

        methodDocumentation.addImplementationNote( implementationNoteText )

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    editMethodDocumentationImplementationNote({ parentWindow: parentWindow, atIndex: index, implementationNoteText: implementationNoteText }) {
        const methodDocumentation = this.getMethodDocumentation()

        const dialog = EditImplementationNoteDialog.new({
            methodDocumentation: methodDocumentation,
            implementationNoteText: implementationNoteText,
            window: parentWindow,
            onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                const handler = this.updateMethodDocumentationImplementationNote({
                    atIndex: index,
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
        atIndex: index, implementationNoteText: implementationNoteText
    }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.updateImplementationNoteAt({
            index: index,
            implementationNoteText: implementationNoteText,
        })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    createMethodDocumentationExample({ parentWindow: parentWindow }) {
        const methodDocumentation = this.getMethodDocumentation()

        const newExample = {
            Description: 'Add the example description here ...',
            Code: 'Add the example code here ...',
        }

        const dialog = EditExampleDialog.new({
            methodDocumentation: methodDocumentation,
            example: newExample,
            window: parentWindow,
            onUpdateExample: ({ example: example }) => {
                this.addMethodDocumentationExample({ example: example })
            },
            acceptButtonLabel: `Add example`,
            title: `${methodDocumentation.getSignatureString()}`,
            subtitle: `You are editing an example of the method ${methodDocumentation.getMethodName()}.`,
        })

        dialog.open()
    }

    addMethodDocumentationExample({ example: example }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.addExample( example )

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    editMethodDocumentationExample({ parentWindow: parentWindow, atIndex: index, example: example }) {
        const methodDocumentation = this.getMethodDocumentation()

        const dialog = EditExampleDialog.new({
            methodDocumentation: methodDocumentation,
            example: example,
            window: parentWindow,
            onUpdateExample: ({ example: example }) => {
                const handler = this.updateMethodDocumentationExample({ atIndex: index, example: example })
            },
            acceptButtonLabel: `Update example`,
            title: `${methodDocumentation.getSignatureString()}`,
            subtitle: `You are editing an example of the method ${methodDocumentation.getMethodName()}.`,
        })

        dialog.open()
    }

    updateMethodDocumentationExample({
        atIndex: index, example: example
    }) {
        const methodDocumentation = this.getMethodDocumentation()

        methodDocumentation.updateExampleAt({
            index: index,
            example: example,
        })

        this.updateMethodDocumentation({
            methodDocumentation: methodDocumentation
        })
    }

    updateMethodDocumentation({ methodDocumentation: methodDocumentation }) {
        this.bubbleUp({
            command: 'updateMethodDocumentation',
            param: { methodDocumentation: methodDocumentation },
        })
    }
}

module.exports = Classification.define(JsMethodDocumentationFlow)
