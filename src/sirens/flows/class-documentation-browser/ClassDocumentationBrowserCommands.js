const Sirens = require('../../../Sirens')

function defineApplicationCommands(application) {
    this.commands({ id: 'applicationCommands' }, function() {

        this.command({
            id: 'reloadClassDefinition',
            enabledIf: function() { return true },
            whenActioned: function() {
                application.reloadClassDefinition()
            }
        })

        this.command({
            id: 'openClassEditor',
            enabledIf: function() { return true },
            whenActioned: function() {
                const filename = application.getBrowsedClass().getSourceFile().getFilePath()
                Sirens.openClassEditor({ filename: filename })
            }
        })

        this.command({
            id: 'openClassDocumentation',
            enabledIf: function() { return true },
            whenActioned: function() {
                const classDefinition = application.getChild({ id: 'classDefinition' }).getObject()
                Sirens.browseClassDocumentation({ classDefinition: classDefinition })
            }
        })

        this.command({
            id: 'openPlayground',
            enabledIf: function() { return true },
            whenActioned: function() {
                Sirens.openPlayground()
            }
        })

    })
}

function defineClassDefinitionCommands(application) {
    this.commands({ id: 'classDefinitionCommands' }, function() {

        this.command({
            id: 'editClassUnformattedComment',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'updateClassUnformattedComment',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ newClassDescription: newClassDescription }) {
                const classDefinition = application.getBrowsedClass()
                const classComment = classDefinition.getComment()
                classComment.writeRawSourceCode({ rawSourceCode: newClassDescription })
                application.reloadClassDefinition()
            }
        })

        this.command({
            id: 'editClassDocumentationComment',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'updateClassDocumentationComment',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ newClassDescription: newClassDescription }) {
                const documentation = application.getChild({ id: 'classDocumentation' }).getValue()
                documentation.setDescription( newClassDescription )
                application.updateClassDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'createClassDocumentationImplementationNote',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'addClassDocumentationImplementationNote',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ implementationNoteText: implementationNoteText }) {
                const documentation = application.getChild({ id: 'classDocumentation' }).getValue()
                documentation.addImplementationNote( implementationNoteText )
                application.updateClassDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'editClassDocumentationImplementationNote',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'updateClassDocumentationImplementationNote',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ atIndex: index, implementationNoteText: implementationNoteText }) {
                const documentation = application.getChild({ id: 'classDocumentation' }).getValue()
                documentation.updateImplementationNoteAt({
                    index: index,
                    implementationNoteText: implementationNoteText,
                })
                application.updateClassDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'deleteClassDocumentationImplementationNote',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ atIndex: index }) {
                const documentation = application.getChild({ id: 'classDocumentation' }).getValue()
                documentation.deleteImplementationNoteAt({ index: index })
                application.updateClassDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'createClassDocumentationExample',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'addClassDocumentationExample',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ example: example }) {
                const documentation = application.getChild({ id: 'classDocumentation' }).getValue()
                documentation.addExample( example )
                application.updateClassDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'editClassDocumentationExample',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'updateClassDocumentationExample',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ atIndex: index, example: example }) {
                const documentation = application.getChild({ id: 'classDocumentation' }).getValue()
                documentation.updateExampleAt({ index: index, example: example })
                application.updateClassDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'deleteClassDocumentationExample',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ atIndex: index }) {
                const documentation = application.getChild({ id: 'classDocumentation' }).getValue()
                documentation.deleteExampleAt({ index: index })
                application.updateClassDocumentation({ documentation: documentation })
            }
        })

    })

    this.commands({ id: 'methodDefinitionCommands' }, function() {

        this.command({
            id: 'editMethodUnformmatedComment',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'updateMethodUnformmatedComment',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ methodNewDescription: methodNewDescription }) {
                const method = application.getChild({ id: 'selectedMethod' }).getValue()
                method.getComment().writeRawSourceCode({ rawSourceCode: methodNewDescription })
                application.reloadClassDefinition()
            }
        })

        this.command({
            id: 'editMethodDocumentationComment',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'updateMethodDocumentationComment',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ methodNewDescription: methodNewDescription }) {
                const method = application.getChild({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.setDescription( methodNewDescription )
                application.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'editMethodDocumentationTags',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'updateMethodDocumentationTags',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ newTags: newTags }) {
                const method = application.getChild({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.setTags( newTags )
                application.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'createMethodDocumentationImplementationNote',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'addMethodDocumentationImplementationNote',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ implementationNoteText: implementationNoteText }) {
                const method = application.getChild({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.addImplementationNote( implementationNoteText )
                application.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'editMethodDocumentationImplementationNote',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'updateMethodDocumentationImplementationNote',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ atIndex: index, implementationNoteText: implementationNoteText }) {
                const method = application.getChild({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.updateImplementationNoteAt({
                    index: index, implementationNoteText: implementationNoteText
                })
                application.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'deleteMethodDocumentationImplementationNote',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ atIndex: index }) {
                const method = application.getChild({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.deleteImplementationNoteAt({ index: index })
                application.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'createMethodDocumentationParam',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'addMethodDocumentationParam',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ param: param }) {
                const method = application.getChild({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.addParam( param )
                application.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'editMethodDocumentationParam',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'updateMethodDocumentationParam',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ atIndex: index, newParam: newParam }) {
                const method = application.getChild({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.updateParamAt({ index: index, param: newParam })
                application.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'deleteMethodDocumentationParam',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ atIndex: index }) {
                const method = application.getChild({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.deleteParamAt({ index: index })
                application.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'editMethodDocumentationReturn',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'updateMethodDocumentationReturn',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ returns: returns }) {
                const method = application.getChild({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.setReturns( returns )
                application.updateMethodDocumentation({ documentation: documentation })
            }
        })


        this.command({
            id: 'createMethodDocumentationExample',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'addMethodDocumentationExample',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ example: example }) {
                console.log( example )
                const method = application.getChild({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.addExample( example )
                application.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'editMethodDocumentationExample',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
        })

        this.command({
            id: 'updateMethodDocumentationExample',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ atIndex: index, example: example }) {
                const method = application.getChild({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.updateExampleAt({ index: index, example: example })
                application.updateMethodDocumentation({ documentation: documentation })
            }
        })

        this.command({
            id: 'deleteMethodDocumentationExample',
            enabledIf: function() {
                return application.isInEditionMode() && application.getBrowsedClass()
            },
            whenActioned: function({ atIndex: index }) {
                const method = application.getChild({ id: 'selectedMethod' }).getValue()
                const documentation = method.getDocumentation()
                documentation.deleteExampleAt({ index: index })
                application.updateMethodDocumentation({ documentation: documentation })
            }
        })

    })
}


module.exports = {
    defineApplicationCommands: defineApplicationCommands,
    defineClassDefinitionCommands: defineClassDefinitionCommands,
}