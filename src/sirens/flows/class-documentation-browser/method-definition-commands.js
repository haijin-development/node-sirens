const Sirens = require('../../../Sirens')

function methodDefinitionCommands(thisFlow) {
    this.category( 'Method definition commands', function() {

        this.command({
            id: 'updateMethodUnformmatedComment',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ methodNewDescription: methodNewDescription }) {
                const method = thisFlow.getChildFlow({ id: 'selectedMethod' }).getValue()
                method.getComment().writeRawSourceCode({ rawSourceCode: methodNewDescription })
                thisFlow.reloadClassDefinition()
            }
        })

        this.command({
            id: 'updateMethodDocumentationComment',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ methodNewDescription: methodNewDescription }) {
                const method = thisFlow.getChildFlow({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.setDescription( methodNewDescription )
                thisFlow.updateMethodDocumentation({ documentation: documentation })
            }
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
            whenActioned: function({ newTags: newTags }) {
                const method = thisFlow.getChildFlow({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.setTags( newTags )
                thisFlow.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'addMethodDocumentationImplementationNote',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ implementationNoteText: implementationNoteText }) {
                const method = thisFlow.getChildFlow({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.addImplementationNote( implementationNoteText )
                thisFlow.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'updateMethodDocumentationImplementationNote',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ atIndex: index, implementationNoteText: implementationNoteText }) {
                const method = thisFlow.getChildFlow({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.updateImplementationNoteAt({
                    index: index, implementationNoteText: implementationNoteText
                })
                thisFlow.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'deleteMethodDocumentationImplementationNote',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ atIndex: index }) {
                const method = thisFlow.getChildFlow({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.deleteImplementationNoteAt({ index: index })
                thisFlow.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'addMethodDocumentationParam',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ param: param }) {
                const method = thisFlow.getChildFlow({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.addParam( param )
                thisFlow.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'updateMethodDocumentationParam',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ atIndex: index, newParam: newParam }) {
                const method = thisFlow.getChildFlow({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.updateParamAt({ index: index, param: newParam })
                thisFlow.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'deleteMethodDocumentationParam',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ atIndex: index }) {
                const method = thisFlow.getChildFlow({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.deleteParamAt({ index: index })
                thisFlow.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'updateMethodDocumentationReturn',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ returns: returns }) {
                const method = thisFlow.getChildFlow({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.setReturns( returns )
                thisFlow.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'addMethodDocumentationExample',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ example: example }) {
                const method = thisFlow.getChildFlow({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.addExample( example )
                thisFlow.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'updateMethodDocumentationExample',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ atIndex: index, example: example }) {
                const method = thisFlow.getChildFlow({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.updateExampleAt({ index: index, example: example })
                thisFlow.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'deleteMethodDocumentationExample',
            enabledIf: function() {
                return thisFlow.isEditingAClass()
            },
            whenActioned: function({ atIndex: index }) {
                const method = thisFlow.getChildFlow({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.deleteExampleAt({ index: index })
                thisFlow.updateMethodDocumentation({ documentation: documentation })
            }
        })

    })
}


module.exports = {
    methodDefinitionCommands: methodDefinitionCommands,
}