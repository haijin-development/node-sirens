const Classification = require('../../../O').Classification
const FlowModel = require('../../../Skins').FlowModel
const ApplicationCommandsRouter = require('../ApplicationCommandsRouter')
const DocumentationReader = require('../../objects/documentation/DocumentationReader')
const Sirens = require('../../../Sirens')

class ClassDocumentationBrowserFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FlowModel]
    }

    /// Building

    buildWith(flow) {
        const commandsRouter = ApplicationCommandsRouter.new({ application: this })

        flow.main( function(application) {

            this.setCommandsRouter( commandsRouter )

            this.evaluate({ closure: application.defineApplicationCommands, params: [application] })

            this.object( 'browsingMode', function() {

                this.toggle({
                    id: 'showsUnformattedComments',
                    whenValueChanges: () => { application.reloadClassDefinition() },
                })

                this.toggle({
                    id: 'isEditingDocumentation',
                    whenValueChanges: () => { application.reloadClassDefinition() },
                })

            })

            this.object({ id: 'classDefinition' }, function(classDefinitionModel) {

                this.evaluate({ closure: application.defineClassDefinitionCommands, params: [application] })

                this.whenObjectChanges( ({ newValue: classDefinition }) => {
                    if( classDefinition === null ) {
                        classDefinitionModel.getChild({ id: 'classDocumentation' }).setValue(null)
                        classDefinitionModel.getChild({ id: 'classMethods' }).setChoices([])
                        classDefinitionModel.getChild({ id: 'selectedTags' }).setValue([])
                        classDefinitionModel.getChild({ id: 'selectedMethod' }).setValue(null)
                        classDefinitionModel.getChild({ id: 'selectedMethodDocumentation' }).setValue(null)
                        return
                    }

                    classDefinitionModel.getChild({ id: 'classDocumentation' }).setValue(
                        application.getClassDocumentationFrom({ classDefinition: classDefinition })
                    )
                    classDefinitionModel.getChild({ id: 'classMethods' }).setChoices(
                        classDefinition.getMethods()
                    )
                    classDefinitionModel.getChild({ id: 'selectedTags' }).setValue( [] )
                })

                this.value({
                    id: 'classDocumentation'
                })

                this.choice({
                    id: 'classMethods',
                    choices: [],
                    whenSelectionChanges: ({ newValue: method }) => {
                        const selectedMethod = classDefinitionModel.getChild({ id: 'selectedMethod' })
                        selectedMethod.setValue( method )
                    },
                })

                this.value({
                    id: 'selectedTags',
                    value: [],
                    whenValueChanges: ({ newValue: tags }) => {
                        const filterdMethods = application.getMethodDefinitionsFilteredByTags({ tagsFilter: tags })
                        classDefinitionModel.getChild({ id: 'classMethods' }).setChoices(filterdMethods)
                    },
                })

                this.object({ id: 'selectedMethod' }, function() {
                    this.whenObjectChanges( ({ newValue: methodDefinition }) => {
                        const methodDocumentation = methodDefinition === null ?
                            null : methodDefinition.getDocumentation()

                        classDefinitionModel.getChild({ id: 'selectedMethodDocumentation' })
                            .setValue( methodDocumentation )
                    })
                })

                this.value({
                    id: 'selectedMethodDocumentation'
                })

            })

            this.notifyCommandsRouterOfEvent({ flowPointId: 'application', event: 'main-flow-built' })
        })
    }

    defineApplicationCommands(application) {
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

    defineClassDefinitionCommands(application) {
        this.commands({ id: 'classDefinitionCommands' }, function() {

            this.command({
                id: 'editClassComment',
                enabledIf: function() {
                    return application.isInEditionMode() && application.getBrowsedClass()
                },
            })

            this.command({
                id: 'updateClassComment',
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

        })

        this.commands({ id: 'methodDefinitionCommands' }, function() {

            this.command({
                id: 'editMethodComment',
                enabledIf: function() {
                    return application.isInEditionMode() && application.getBrowsedClass()
                },
            })

            this.command({
                id: 'updateMethodComment',
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

        })
    }

    /// Actions

    reloadClassDefinition() {
        const classDefinition = this.getBrowsedClass()

        const selectedMethod = this.getChild({ id: 'selectedMethod' }).getValue()

        this.setBrowsedClass({ classDefinition: null })

        classDefinition.reload()

        this.setBrowsedClass({ classDefinition: classDefinition })

        if( selectedMethod ) {
            this.setBrowsedMethod({ methodName: selectedMethod.getName() })
        }
    }

    getClassDocumentationFrom({ classDefinition: classDefinition }) {
        if( ! classDefinition ) { return null }

        const className = classDefinition.getClassName()

        const unformattedComment = classDefinition.getComment().getContents()

        return DocumentationReader.readClassDocumentationFromString({
            string: unformattedComment,
            className: className,
        })
    }

    /// Querying

    getBrowsedClass() {
        return this.getChild({ id: 'classDefinition' }).getObject()
    }

    setBrowsedClass({ classDefinition: classDefinition }) {
        return this.getChild({ id: 'classDefinition' }).setObject( classDefinition )
    }

    setBrowsedMethod({ methodName: methodName }) {
        if( methodName === null ) { return }

        this.getChild({ id: 'classMethods' }).setSelectionSuchThat({
            matches: (method) => { return method.getName() === methodName }
        })
    }

    showsUnformattedComments() {
        return this.getChild({ id: 'showsUnformattedComments' }).getValue()
    }

    isInEditionMode() {
        return this.getChild({ id: 'isEditingDocumentation' }).getValue()
    }

    getAllMethodsTags() {
        const browsedClass = this.getBrowsedClass()

        if( browsedClass === null ) { return [] }

        const allMethodsTagsSet = new Set()

        const allMethodsDefinition = browsedClass.getMethods()

        allMethodsDefinition.forEach( (methodDefinition) => {
            const methodTags = methodDefinition.getDocumentation().getTags()

            methodTags.forEach( (tag) => {
                allMethodsTagsSet.add( tag )
            })
        })

        const allMethodsTags = allMethodsTagsSet.values()

        return Array.from( allMethodsTags )
    }

    getSelectedTagsModel() {
        return []
    }

    getMethodDefinitionsFilteredByTags({ tagsFilter: tagsFilter }) {
        const browsedClass = this.getBrowsedClass()

        if( browsedClass === null ) { return [] }

        const methodDefinitions = browsedClass.getMethods()

        if( tagsFilter.length === 0 ) { return methodDefinitions }

        const methodsWithSelectedTags = []

        methodDefinitions.forEach( (methodDefinition) => {
            const methodTags = methodDefinition.getDocumentation().getTags()

            const includeMethod = tagsFilter.every( (tagFilter) => {
                return methodTags.includes( tagFilter )
            })

            if( includeMethod === true ) {
                methodsWithSelectedTags.push( methodDefinition )
            }
        })

        return methodsWithSelectedTags
    }

    updateMethodDocumentation({ documentation: documentation }) {
        const methodCommentContents = documentation.generateCommentContents({
                methodDocumentation: documentation,
            })

        const method = this.getChild({ id: 'selectedMethod' }).getValue()

        const methodComment = method.getComment()

        methodComment.writeFormattedContents({ commentContents: methodCommentContents })

        this.reloadClassDefinition()
    }
}

module.exports = Classification.define(ClassDocumentationBrowserFlow)