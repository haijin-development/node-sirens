const Sirens = require('../../../Sirens')
const EditTagsDialog = require ('../../components/class-documentation-browser/edition/EditTagsDialog')
const EditMethodCommentDialog = require('../../components/class-documentation-browser/edition/EditMethodCommentDialog')
const EditParamDialog = require ('../../components/class-documentation-browser/edition/EditParamDialog')
const EditReturnsDialog = require('../../components/class-documentation-browser/edition/EditReturnsDialog')
const EditImplementationNoteDialog = require('../../components/class-documentation-browser/edition/EditImplementationNoteDialog')
const EditExampleDialog = require('../../components/class-documentation-browser/edition/EditExampleDialog')

function guiMethodDocumentationCommands(thisFlow) {

    this.category( 'commands that make use of the GUI components.', () => {

        this.command({
            id: 'editMethodDocumentationComment',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: ({ parentWindow: parentWindow }) => {
                const className = thisFlow.getBrowsedClass().getClassName()

                const method = thisFlow.getFlowPoint({ id: 'selectedMethod' }).getValue()

                const dialog = EditMethodCommentDialog.new({
                    className: className,
                    method: method,
                    window: parentWindow,
                    onUpdateMethodComment: ({ methodNewDescription: methodNewDescription }) => {
                        thisFlow.executeCommand({
                            id: 'updateMethodDocumentationComment',
                            with: { methodNewDescription: methodNewDescription }
                        })
                    },
                    unformatted: false,
                })

                dialog.open()
            },
        })

        this.command({
            id: 'createMethodDocumentationImplementationNote',
            enabledIf: () => { thisFlow.isEditingAClass() },
            whenActioned: ({ parentWindow: parentWindow }) => {
                const className = thisFlow.getBrowsedClass().getClassName()

                const method = thisFlow.getCurrentMethod()

                const dialog = EditImplementationNoteDialog.new({
                    className: className,
                    implementationNoteText: 'Add the new implementation note here ...',
                    window: parentWindow,
                    onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                        thisFlow.executeCommand({
                            id: 'addMethodDocumentationImplementationNote',
                            with: { implementationNoteText: implementationNoteText },
                        })
                    },
                    acceptButtonLabel: `Add implementation note`,
                    title: `${className}.${method.getFunctionSignatureString()}`,
                    subtitle: `You are editing an implementation note of the method ${className}.${method.getMethodName()}.`,
                })

                dialog.open()
            },
        })

        this.command({
            id: 'editMethodDocumentationImplementationNote',
            enabledIf: () => { thisFlow.isEditingAClass() },
            whenActioned: ({ parentWindow: parentWindow, atIndex: index, implementationNoteText: implementationNoteText }) => {
                const className = thisFlow.getBrowsedClass().getClassName()

                const method = thisFlow.getCurrentMethod()

                const dialog = EditImplementationNoteDialog.new({
                    className: className,
                    implementationNoteText: implementationNoteText,
                    window: parentWindow,
                    onUpdateImplementationNote: ({ implementationNoteText: implementationNoteText }) => {
                        const handler = thisFlow.executeCommand({
                            id: 'updateMethodDocumentationImplementationNote',
                            with: { atIndex: index, implementationNoteText: implementationNoteText },
                        })
                    },
                    acceptButtonLabel: `Update implementation note`,
                    title:  `${className} implementation note.`,
                    subtitle: `You are editing an implementation note of the method ${className}.${method.getMethodName()}.`,
                })

                dialog.open()                
            },
        })

        this.command({
            id: 'createMethodDocumentationExample',
            enabledIf: () => { thisFlow.isEditingAClass() },
            whenActioned: ({ parentWindow: parentWindow }) => {
                const className = thisFlow.getBrowsedClass().getClassName()

                const method = thisFlow.getCurrentMethod()

                const newExample = {
                    Description: 'Add the example description here ...',
                    Code: 'Add the example code here ...',
                }

                const dialog = EditExampleDialog.new({
                    className: className,
                    example: newExample,
                    window: parentWindow,
                    onUpdateExample: ({ example: example }) => {
                        thisFlow.executeCommand({
                            id: 'addMethodDocumentationExample',
                            with: { example: example }
                        })
                    },
                    acceptButtonLabel: `Add example`,
                    title: `${className}.${method.getFunctionSignatureString()}`,
                    subtitle: `You are editing an example of the method ${className}.${method.getMethodName()}.`,
                })

                dialog.open()
            },
        })

        this.command({
            id: 'editMethodDocumentationExample',
            enabledIf: () => { thisFlow.isEditingAClass() },
            whenActioned: ({ parentWindow: parentWindow, atIndex: index, example: example }) => {
                const className = thisFlow.getBrowsedClass().getClassName()

                const method = thisFlow.getCurrentMethod()

                const dialog = EditExampleDialog.new({
                    className: className,
                    example: example,
                    window: parentWindow,
                    onUpdateExample: ({ example: example }) => {
                        const handler = thisFlow.executeCommand({
                            id: 'updateMethodDocumentationExample',
                            with: { atIndex: index, example: example },
                        })
                    },
                    acceptButtonLabel: `Update example`,
                    title: `${className}.${method.getFunctionSignatureString()}`,
                    subtitle: `You are editing an example of the method ${className}.${method.getMethodName()}.`,
                })

                dialog.open()
            },
        })

        this.command({
            id: 'editMethodDocumentationParam',
            whenActioned: ({ parentWindow: parentWindow, param: param, paramIndex: paramIndex }) => {
                const className = thisFlow.getBrowsedClass().getClassName()

                const method = thisFlow.getFlowPoint({ id: 'selectedMethod' }).getValue()

                const dialog = EditParamDialog.new({
                    className: className,
                    method: method,
                    param: param,
                    window: parentWindow,
                    onUpdateParam: ({ param: newParam }) => {
                        const actionHandler = thisFlow.executeCommand({
                            id: 'updateMethodDocumentationParam',
                            with: { atIndex: paramIndex, newParam: newParam },
                        })
                    },
                    acceptButtonLabel: `Update param`,
                })

                dialog.open()
            }
        })

        this.command({
            id: 'createMethodDocumentationParam',
            whenActioned: ({ parentWindow: parentWindow }) => {
                const className = thisFlow.getBrowsedClass().getClassName()
                const method = thisFlow.getFlowPoint({ id: 'selectedMethod' }).getValue()
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
                        thisFlow.executeCommand({
                            id: 'addMethodDocumentationParam',
                            with: { param: param },
                        })
                    },
                    acceptButtonLabel: `Add param`,
                })

                dialog.open()
            }
        })

        this.command({
            id: 'editMethodDocumentationReturn',
            whenActioned: ({ parentWindow: parentWindow }) => {
                const className = thisFlow.getBrowsedClass().getClassName()

                const method = thisFlow.getFlowPoint({ id: 'selectedMethod' }).getValue()

                const documentation = method.getDocumentation()

                const dialog = EditReturnsDialog.new({
                    className: className,
                    method: method,
                    returns: documentation.getReturns(),
                    window: parentWindow,
                    onUpdateReturns: ({ returns: returns }) => {
                        thisFlow.executeCommand({
                            id: 'updateMethodDocumentationReturn',
                            with: { returns: returns },
                        })
                    },
                    acceptButtonLabel: `Update returns`,
                })

                dialog.open()
            }
        })

        this.command({
            id: 'editMethodTags',
            whenActioned: ({ parentWindow: parentWindow }) => {
                const className = thisFlow.getBrowsedClass().getClassName()

                const method = thisFlow.getFlowPoint({ id: 'selectedMethod' }).getValue()

                const documentation = method.getDocumentation()

                const tags = documentation.getTags()

                const dialog = EditTagsDialog.new({
                    className: className,
                    method: method,
                    tags: tags,
                    window: parentWindow,
                    onUpdateTags: ({ newTags: newTags }) => {
                        thisFlow.executeCommand({
                            id: 'updateMethodDocumentationTags',
                            with: { newTags: newTags }
                        })
                    },
                    acceptButtonLabel: 'Update method tags',
                })

                dialog.open()
            }
        })

        this.command({
            id: 'editMethodUnformmatedComment',
            whenActioned: ({ parentWindow: parentWindow }) => {
                const className = thisFlow.getBrowsedClass().getClassName()

                const method = thisFlow.getCurrentMethod()

                const dialog = EditMethodCommentDialog.new({
                    className: className,
                    method: method,
                    window: parentWindow,
                    onUpdateMethodComment: ({ methodNewDescription: methodNewDescription }) => {
                        thisFlow.executeCommand({
                            id: 'updateMethodUnformmatedComment',
                            with: { methodNewDescription: methodNewDescription },
                        })
                    },
                    unformatted: true,
                })

                dialog.open()
            }
        })

    })
}

module.exports = {
    guiMethodDocumentationCommands: guiMethodDocumentationCommands,
}