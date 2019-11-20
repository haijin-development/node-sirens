const Classification = require('../../../O').Classification
const FlowModel = require('../../../Skins').FlowModel
const ApplicationCommandsRouter = require('../ApplicationCommandsRouter')
const DocumentationReader = require('../../objects/documentation/DocumentationReader')
const Sirens = require('../../../Sirens')
const {defineApplicationCommands, defineClassDefinitionCommands} = require('./ClassDocumentationBrowserCommands')

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

            this.evaluate({ closure: defineApplicationCommands, params: [application] })

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

                this.evaluate({ closure: defineClassDefinitionCommands, params: [application] })

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

    updateClassDocumentation({ documentation: documentation }) {
        const classCommentContents = documentation.generateCommentContents({
                methodDocumentation: documentation,
            })

        const classDefinition = this.getBrowsedClass()

        const classComment = classDefinition.getComment()

        classComment.writeFormattedContents({ commentContents: classCommentContents })

        this.reloadClassDefinition()
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