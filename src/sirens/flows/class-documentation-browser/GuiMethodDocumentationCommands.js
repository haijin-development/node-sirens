const Classification = require('../../../O').Classification
const Sirens = require('../../../Sirens')
const EditTagsDialog = require ('../../components/class-documentation-browser/edition/EditTagsDialog')
const EditMethodCommentDialog = require('../../components/class-documentation-browser/edition/EditMethodCommentDialog')
const EditParamDialog = require ('../../components/class-documentation-browser/edition/EditParamDialog')
const EditReturnsDialog = require('../../components/class-documentation-browser/edition/EditReturnsDialog')
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

        flowBuilder.commandsGroup({ id: 'gui-method-documentation-commands' }, function() {

            this.command({
                id: 'editMethodDocumentationComment',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.editMethodDocumentationComment.bind(thisFlow),
            })

            this.command({
                id: 'createMethodDocumentationImplementationNote',
                enabledIf: () => { thisFlow.isEditingAClass() },
                whenActioned: thisFlow.createMethodDocumentationImplementationNote.bind(thisFlow),
            })

            this.command({
                id: 'editMethodDocumentationImplementationNote',
                enabledIf: () => { thisFlow.isEditingAClass() },
                whenActioned: thisFlow.editMethodDocumentationImplementationNote.bind(thisFlow),
            })

            this.command({
                id: 'createMethodDocumentationExample',
                enabledIf: () => { thisFlow.isEditingAClass() },
                whenActioned: thisFlow.createMethodDocumentationExample.bind(thisFlow),
            })

            this.command({
                id: 'editMethodDocumentationExample',
                enabledIf: () => { thisFlow.isEditingAClass() },
                whenActioned: thisFlow.editMethodDocumentationExample.bind(thisFlow),
            })

            this.command({
                id: 'editMethodDocumentationParam',
                whenActioned: thisFlow.editMethodDocumentationParam.bind(thisFlow),
            })

            this.command({
                id: 'createMethodDocumentationParam',
                whenActioned: thisFlow.createMethodDocumentationParam.bind(thisFlow),
            })

            this.command({
                id: 'editMethodDocumentationReturn',
                whenActioned: thisFlow.editMethodDocumentationReturn.bind(thisFlow),
            })

            this.command({
                id: 'editMethodTags',
                whenActioned: thisFlow.editMethodTags.bind(thisFlow),
            })

            this.command({
                id: 'editMethodUnformmatedComment',
                whenActioned: thisFlow.editMethodUnformmatedComment.bind(thisFlow),
            })

        })
    }

    editMethodDocumentationComment({ parentWindow: parentWindow }) {
        const className = this.getBrowsedClass().getClassName()

        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const dialog = EditMethodCommentDialog.new({
            className: className,
            method: method,
            window: parentWindow,
            onUpdateMethodComment: ({ methodNewDescription: methodNewDescription }) => {
                this.updateMethodDocumentationComment({ methodNewDescription: methodNewDescription })
            },
            unformatted: false,
        })

        dialog.open()
    }

    createMethodDocumentationImplementationNote({ parentWindow: parentWindow }) {
        const className = this.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const dialog = EditImplementationNoteDialog.new({
            className: className,
            implementationNoteText: 'Add the new implementation note here ...',
            window: parentWindow,
            onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                this.addMethodDocumentationImplementationNote({ implementationNoteText: implementationNoteText })
            },
            acceptButtonLabel: `Add implementation note`,
            title: `${className}.${method.getFunctionSignatureString()}`,
            subtitle: `You are editing an implementation note of the method ${className}.${method.getMethodName()}.`,
        })

        dialog.open()
    }

    editMethodDocumentationImplementationNote({ parentWindow: parentWindow, atIndex: index, implementationNoteText: implementationNoteText }) {
        const className = this.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const dialog = EditImplementationNoteDialog.new({
            className: className,
            implementationNoteText: implementationNoteText,
            window: parentWindow,
            onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                const handler = this.updateMethodDocumentationImplementationNote({
                    atIndex: index,
                    implementationNoteText: implementationNoteText
                })
            },
            acceptButtonLabel: `Update implementation note`,
            title:  `${className} implementation note.`,
            subtitle: `You are editing an implementation note of the method ${className}.${method.getMethodName()}.`,
        })

        dialog.open()                
    }

    createMethodDocumentationExample({ parentWindow: parentWindow }) {
        const className = this.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const newExample = {
            Description: 'Add the example description here ...',
            Code: 'Add the example code here ...',
        }

        const dialog = EditExampleDialog.new({
            className: className,
            example: newExample,
            window: parentWindow,
            onUpdateExample: ({ example: example }) => {
                this.addMethodDocumentationExample({ example: example })
            },
            acceptButtonLabel: `Add example`,
            title: `${className}.${method.getFunctionSignatureString()}`,
            subtitle: `You are editing an example of the method ${className}.${method.getMethodName()}.`,
        })

        dialog.open()
    }

    editMethodDocumentationExample({ parentWindow: parentWindow, atIndex: index, example: example }) {
        const className = this.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const dialog = EditExampleDialog.new({
            className: className,
            example: example,
            window: parentWindow,
            onUpdateExample: ({ example: example }) => {
                const handler = this.updateMethodDocumentationExample({ atIndex: index, example: example })
            },
            acceptButtonLabel: `Update example`,
            title: `${className}.${method.getFunctionSignatureString()}`,
            subtitle: `You are editing an example of the method ${className}.${method.getMethodName()}.`,
        })

        dialog.open()
    }

    editMethodDocumentationParam({ parentWindow: parentWindow, param: param, paramIndex: paramIndex }) {
        const className = this.getBrowsedClass().getClassName()

        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const dialog = EditParamDialog.new({
            className: className,
            method: method,
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

    createMethodDocumentationParam({ parentWindow: parentWindow }) {
        const className = this.getBrowsedClass().getClassName()
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()
        const newParam = {
            Name: 'Add the name of the parameter here ...',
            Description: 'Add the parameter description ...',
        }
        const dialog = EditParamDialog.new({
            className: className,
            method: method,
            param: newParam,
            window: parentWindow,
            onUpdateParam: ({ param: param }) => {
                this.addMethodDocumentationParam({ param: param })
            },
            acceptButtonLabel: `Add param`,
        })

        dialog.open()
    }

    editMethodDocumentationReturn({ parentWindow: parentWindow }) {
        const className = this.getBrowsedClass().getClassName()

        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        const dialog = EditReturnsDialog.new({
            className: className,
            method: method,
            returns: documentation.getReturns(),
            window: parentWindow,
            onUpdateReturns: ({ returns: returns }) => {
                this.updateMethodDocumentationReturn({ returns: returns })
            },
            acceptButtonLabel: `Update returns`,
        })

        dialog.open()
    }

    editMethodTags({ parentWindow: parentWindow }) {
        const className = this.getBrowsedClass().getClassName()

        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        const tags = documentation.getTags()

        const dialog = EditTagsDialog.new({
            className: className,
            method: method,
            tags: tags,
            window: parentWindow,
            onUpdateTags: ({ newTags: newTags }) => {
                this.updateMethodDocumentationTags({ newTags: newTags })
            },
            acceptButtonLabel: 'Update method tags',
        })

        dialog.open()
    }

    editMethodUnformmatedComment({ parentWindow: parentWindow }) {
        const className = this.getBrowsedClass().getClassName()

        const method = this.getCurrentMethod()

        const dialog = EditMethodCommentDialog.new({
            className: className,
            method: method,
            window: parentWindow,
            onUpdateMethodComment: ({ methodNewDescription: methodNewDescription }) => {
                this.updateMethodUnformmatedComment({ methodNewDescription: methodNewDescription })
            },
            unformatted: true,
        })

        dialog.open()
    }
}

        
module.exports = Classification.define(GuiClassDocumentationCommands)