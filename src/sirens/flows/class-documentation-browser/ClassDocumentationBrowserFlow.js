const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const ApplicationCommandsController = require('../ApplicationCommandsController')
const DocumentationReader = require('../../objects/documentation/DocumentationReader')
const Sirens = require('../../../Sirens')
const {applicationCommands} = require('./application-commands')
const {classDefinitionCommands} = require('./class-definition-commands')
const {methodDefinitionCommands} = require('./method-definition-commands')
const {guiClassDocumentationCommands} = require('./gui-class-documentation-commands')
const {guiMethodDocumentationCommands} = require('./gui-method-documentation-commands')

class ClassDocumentationBrowserFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        const commandsController = ApplicationCommandsController.new({ mainFlow: this })

        flow.main({ id: 'classDocumentationBrowser' }, function(thisFlow) {

            this.setCommandsController( commandsController )

            this.defineFlowCommandsIn({ method: thisFlow.flowMethods })
            this.defineFlowCommandsIn({ method: applicationCommands })
            this.defineFlowCommandsIn({ method: classDefinitionCommands })
            this.defineFlowCommandsIn({ method: methodDefinitionCommands })

            this.defineFlowCommandsIn({ method: guiClassDocumentationCommands })
            this.defineFlowCommandsIn({ method: guiMethodDocumentationCommands })
            
            this.value({ id: 'browsingMode'}, function() {

                this.toggle({
                    id: 'showsUnformattedComments',
                    whenValueChanges: () => { thisFlow.reloadClassDefinition() },
                })

                this.toggle({
                    id: 'isEditingDocumentation',
                    whenValueChanges: () => { thisFlow.reloadClassDefinition() },
                })

            })

            this.value({ id: 'classDefinition' }, function(classDefinitionModel) {

                this.whenObjectChanges( ({ newValue: classDefinition }) => {
                    if( classDefinition === null ) {
                        classDefinitionModel.getChildFlow({ id: 'classDocumentation' }).setValue(null)
                        classDefinitionModel.getChildFlow({ id: 'classMethods' }).setChoices([])
                        classDefinitionModel.getChildFlow({ id: 'selectedTags' }).setValue([])
                        classDefinitionModel.getChildFlow({ id: 'selectedMethod' }).setValue(null)
                        classDefinitionModel.getChildFlow({ id: 'selectedMethodDocumentation' }).setValue(null)
                        return
                    }

                    classDefinitionModel.getChildFlow({ id: 'classDocumentation' }).setValue(
                        thisFlow.getClassDocumentationFrom({ classDefinition: classDefinition })
                    )
                    classDefinitionModel.getChildFlow({ id: 'classMethods' }).setChoices(
                        classDefinition.getMethods()
                    )
                    classDefinitionModel.getChildFlow({ id: 'selectedTags' }).setValue( [] )
                })

                this.value({
                    id: 'classDocumentation'
                })

                this.choice({
                    id: 'classMethods',
                    choices: [],
                    whenSelectionChanges: ({ newValue: method }) => {
                        const selectedMethod = classDefinitionModel.getChildFlow({ id: 'selectedMethod' })
                        selectedMethod.setValue( method )
                    },
                })

                this.value({
                    id: 'selectedTags',
                    value: [],
                    whenValueChanges: ({ newValue: tags }) => {
                        const filterdMethods = thisFlow.getMethodDefinitionsFilteredByTags({ tagsFilter: tags })
                        classDefinitionModel.getChildFlow({ id: 'classMethods' }).setChoices(filterdMethods)
                    },
                })

                this.value({ id: 'selectedMethod' }, function() {
                    this.whenObjectChanges( ({ newValue: methodDefinition }) => {
                        const methodDocumentation = methodDefinition === null ?
                            null : methodDefinition.getDocumentation()

                        classDefinitionModel.getChildFlow({ id: 'selectedMethodDocumentation' })
                            .setValue( methodDocumentation )
                    })
                })

                this.value({
                    id: 'selectedMethodDocumentation'
                })

            })

            thisFlow.evaluateEventHandler({ event: 'application-flow-built', eventHandler: () => {} })
        })
    }

    flowMethods(thisFlow) {
        this.category( 'flow methods', () => {

            this.command({
                id: 'getBrowsedClass',
                whenActioned: function() {
                    return thisFlow.getBrowsedClass()
                }
            })

            this.command({
                id: 'setBrowsedClass',
                whenActioned: function({ classDefinition: classDefinition }) {
                    thisFlow.setBrowsedClass({ classDefinition: classDefinition })
                }
            })

            this.command({
                id: 'setBrowsedMethod',
                whenActioned: function({ methodName: methodName }) {
                    thisFlow.setBrowsedMethod({ methodName: methodName })
                }
            })

            this.command({
                id: 'showsUnformattedComments',
                whenActioned: function() {
                    return thisFlow.showsUnformattedComments()
                }
            })

            this.command({
                id: 'getAllMethodsTags',
                whenActioned: function() {
                    return thisFlow.getAllMethodsTags()
                }
            })

            this.command({
                id: 'isInEditionMode',
                whenActioned: function() {
                    return thisFlow.getChildFlow({ id: 'browsingMode.isEditingDocumentation' }).getValue()
                }
            })

        })
    }

    /// Actions

    reloadClassDefinition() {
        const classDefinition = this.getBrowsedClass()

        const selectedMethod = this.getChildFlow({ id: 'selectedMethod' }).getValue()

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
        return this.getChildFlow({ id: 'classDefinition' }).getValue()
    }

    setBrowsedClass({ classDefinition: classDefinition }) {
        return this.getChildFlow({ id: 'classDefinition' }).setValue( classDefinition )
    }

    setBrowsedMethod({ methodName: methodName }) {
        if( methodName === null ) { return }

        this.getChildFlow({ id: 'classMethods' }).setSelectionSuchThat({
            matches: (method) => { return method.getName() === methodName }
        })
    }

    showsUnformattedComments() {
        return this.getChildFlow({ id: 'browsingMode.showsUnformattedComments' }).getValue()
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

    isInEditionMode() {
        return this.getChildFlow({ id: 'browsingMode.isEditingDocumentation' }).getValue()
    }

    isEditingAClass() {
        return this.isInEditionMode() && this.getBrowsedClass()
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

        const method = this.getChildFlow({ id: 'selectedMethod' }).getValue()

        const methodComment = method.getComment()

        methodComment.writeFormattedContents({ commentContents: methodCommentContents })

        this.reloadClassDefinition()
    }

    getCurrentMethod() {
        return this.getChildFlow({ id: 'selectedMethod' }).getValue()
    }

    getCurrentMethodDocumentation() {
        return this.getChildFlow({ id: 'selectedMethodDocumentation' }).getValue()
    }
}

module.exports = Classification.define(ClassDocumentationBrowserFlow)