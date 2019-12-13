const Classification = require('../../../O').Classification

class MethodDefinitionCommands {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
    }

    flowCommands({ flowBuilder: flowBuilder, thisFlow: thisFlow }) {

        this.previousClassificationDo( () => {
            this.flowCommands({ flowBuilder: flowBuilder, thisFlow: thisFlow })
        })

        flowBuilder.commandsGroup({ id: 'method-definition-commands' }, function() {

            this.command({
                id: 'updateMethodUnformmatedComment',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.updateMethodUnformmatedComment.bind(thisFlow),
            })

            this.command({
                id: 'updateMethodDocumentationComment',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.updateMethodDocumentationComment.bind(thisFlow),
            })

            this.command({
                id: 'editMethodDocumentationTags',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
            })

            this.command({
                id: 'updateMethodDocumentationTags',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.updateMethodDocumentationTags.bind(thisFlow),
            })

            this.command({
                id: 'addMethodDocumentationImplementationNote',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.addMethodDocumentationImplementationNote.bind(thisFlow),
            })

            this.command({
                id: 'updateMethodDocumentationImplementationNote',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.updateMethodDocumentationImplementationNote.bind(thisFlow),
            })

            this.command({
                id: 'deleteMethodDocumentationImplementationNote',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.deleteMethodDocumentationImplementationNote.bind(thisFlow),
            })

            this.command({
                id: 'addMethodDocumentationParam',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.addMethodDocumentationParam.bind(thisFlow),
            })

            this.command({
                id: 'updateMethodDocumentationParam',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.updateMethodDocumentationParam.bind(thisFlow)
            })

            this.command({
                id: 'deleteMethodDocumentationParam',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.deleteMethodDocumentationParam.bind(thisFlow),
            })

            this.command({
                id: 'updateMethodDocumentationReturn',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.updateMethodDocumentationReturn.bind(thisFlow),
            })

            this.command({
                id: 'addMethodDocumentationExample',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.addMethodDocumentationExample.bind(thisFlow),
            })

            this.command({
                id: 'updateMethodDocumentationExample',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.updateMethodDocumentationExample.bind(thisFlow),
            })

            this.command({
                id: 'deleteMethodDocumentationExample',
                enabledIf: function() {
                    return thisFlow.isEditingAClass()
                },
                whenActioned: thisFlow.deleteMethodDocumentationExample.bind(thisFlow),
            })

        })
    }

    updateMethodUnformmatedComment({ methodNewDescription: methodNewDescription }) {
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        method.getMethodComment().writeContents({
            contents: methodNewDescription
        })

        this.reloadClassDefinition()
    }

    updateMethodDocumentationComment({ methodNewDescription: methodNewDescription }) {
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        documentation.setDescription( methodNewDescription )

        this.updateMethodDocumentation({ documentation: documentation })
    }

    updateMethodDocumentationTags({ newTags: newTags }) {
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        documentation.setTags( newTags )

        this.updateMethodDocumentation({ documentation: documentation })
    }

    addMethodDocumentationImplementationNote({ implementationNoteText: implementationNoteText }) {
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        documentation.addImplementationNote( implementationNoteText )

        this.updateMethodDocumentation({ documentation: documentation })
    }

    updateMethodDocumentationImplementationNote({ atIndex: index, implementationNoteText: implementationNoteText }) {
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        documentation.updateImplementationNoteAt({
            index: index, implementationNoteText: implementationNoteText
        })

        this.updateMethodDocumentation({ documentation: documentation })
    }

    deleteMethodDocumentationImplementationNote({ atIndex: index }) {
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        documentation.deleteImplementationNoteAt({ index: index })

        this.updateMethodDocumentation({ documentation: documentation })
    }

    addMethodDocumentationParam({ param: param }) {
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        documentation.addParam( param )

        this.updateMethodDocumentation({ documentation: documentation })
    }

    updateMethodDocumentationParam({ atIndex: index, newParam: newParam }) {
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        documentation.updateParamAt({ index: index, param: newParam })

        this.updateMethodDocumentation({ documentation: documentation })
    }

    deleteMethodDocumentationParam({ atIndex: index }) {
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        documentation.deleteParamAt({ index: index })

        this.updateMethodDocumentation({ documentation: documentation })
    }

    updateMethodDocumentationReturn({ returns: returns }) {
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        documentation.setReturns( returns )

        this.updateMethodDocumentation({ documentation: documentation })
    }

    updateMethodDocumentationExample({ atIndex: index, example: example }) {
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        documentation.updateExampleAt({ index: index, example: example })

        this.updateMethodDocumentation({ documentation: documentation })
    }

    deleteMethodDocumentationExample({ atIndex: index }) {
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        documentation.deleteExampleAt({ index: index })

        this.updateMethodDocumentation({ documentation: documentation })
    }

    addMethodDocumentationExample({ example: example }) {
        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const documentation = method.getDocumentation()

        documentation.addExample( example )

        this.updateMethodDocumentation({ documentation: documentation })
    }
}

module.exports = Classification.define(MethodDefinitionCommands)