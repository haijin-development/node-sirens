const Classification = require('../../o-language/classifications/Classification')
const BufferedAttributeModel = require('../../gui/models/BufferedAttributeModel')
const ValueModel = require('../../gui/models/ValueModel')
const ChoiceModel = require('../../gui/models/ChoiceModel')
const ClassDocumentation = require('../objects/documentation/ClassDocumentation')
const MethodDocumentation = require('../objects/documentation/MethodDocumentation')

class ClassDocumentationBrowserModel {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'classDefinition',

            'documentationChangedModel',

            'showUnformattedCommentsModel',

            'editionModeModel',

            'classMethodsModel',

            'selectedMethodModel',

            'selectedTagsModel',
        ]
    }


    /// Initializing

    initialize({ classDefinition: classDefinition, selectedMethodName: selectedMethodName }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.classDefinition = classDefinition

        this.documentationChangedModel = ValueModel.new()

        this.showUnformattedCommentsModel = ValueModel.new({ value: false })

        this.editionModeModel = ValueModel.new({ value: false })

        this.classMethodsModel = ChoiceModel.new({
            choices: classDefinition.getMethods(),
            selection: undefined,
        })

        this.selectedMethodModel = ValueModel.new()

        this.selectedTagsModel = ValueModel.new({
            value: []
        })

        this.connectModels()

        this.setSelectedMethod({ named: selectedMethodName })
    }

    /// Accessing

    getDocumentationChangedModel() {
        return this.documentationChangedModel
    }

    getShowUnformattedCommentsModel() {
        return this.showUnformattedCommentsModel
    }

    getEditionModeModel() {
        return this.editionModeModel
    }

    getClassDefinition() {
        return this.classDefinition
    }

    getClassMethodsModel() {
        return this.classMethodsModel
    }

    getSelectedMethodModel() {
        return this.selectedMethodModel
    }

    getSelectedTagsModel() {
        return this.selectedTagsModel
    }

    /// Querying

    getSelectedMethod() {
        return this.selectedMethodModel.getValue()
    }

    getSelectedMethodDocumentation() {
        const method = this.getSelectedMethod()

        if( method === null ) {
            return MethodDocumentation.new().yourself( (documentation) => {
                documentation.setDescription( 'No method selected.' )
            })
        }

        const unformattedComment = method.getComment().getContents()

        return MethodDocumentation.isDocumentationString({
            string: unformattedComment,
            ifTrue: (documentation) => {
                documentation.setMethodName( method.getName() )
                documentation.setMethodParams( method.getParams() )
                return documentation
            },
            ifFalse: () => {
                const documentation = MethodDocumentation.new()
                documentation.setMethodName( method.getName() )
                documentation.setMethodParams( method.getParams() )
                documentation.setDescription( unformattedComment )
                return documentation
            },
        })
    }

    showsUnformattedComments() {
        return this.showUnformattedCommentsModel.getValue() === true
    }

    isInEditionMode() {
        return this.editionModeModel.getValue() === true
    }

    getClassName() {
        return this.classDefinition.getClassName()
    }

    getClassUnformattedComment() {
        return this.classDefinition.getComment().getSourceCode()
    }

    getClassDocumentation() {
        const className = this.classDefinition.getClassName()

        const unformattedComment = this.classDefinition.getComment().getContents()

        return ClassDocumentation.isDocumentationString({
            string: unformattedComment,
            ifTrue: (documentation) => {
                documentation.setClassName( className )
                return documentation
            },
            ifFalse: () => {
                const documentation = ClassDocumentation.new()
                documentation.setClassName( className )
                documentation.setDescription( unformattedComment )
                return documentation
            },
        })
    }

    setSelectedMethod({ named: selectedMethodName }) {
        this.classMethodsModel.setSelectionSuchThat({
            matches: (method) => { return method.getName() === selectedMethodName }
        })
    }

    getAllMethodsTags() {
        const allMethodsTagsSet = new Set()

        const allMethodsDefinition = this.classDefinition.getMethods()

        allMethodsDefinition.forEach( (methodDefinition) => {
            const methodTags = methodDefinition.getDocumentation().getTags()

            methodTags.forEach( (tag) => {
                allMethodsTagsSet.add( tag )
            })
        })

        const allMethodsTags = allMethodsTagsSet.values()

        return Array.from( allMethodsTags )
    }

    /// Actions

    reload() {
        const selectedMethod = this.getSelectedMethod()

        this.classDefinition.reload()

        this.classMethodsModel.setChoices(
            this.classDefinition.getMethods()
        )

        if( selectedMethod !== null ) {
            this.classMethodsModel.setSelectionSuchThat({
                matches: (method) => {
                    return method.getName() === selectedMethod.getName()
                }
            })
        }

        this.triggerDocumentationChanged()
    }

    /// Events

    connectModels() {
        this.classMethodsModel.onSelectionChanged( this.onMethodSelectionChanged.bind(this) )

        this.showUnformattedCommentsModel.onValueChanged( this.triggerDocumentationChanged.bind(this) )
        this.editionModeModel.onValueChanged( this.triggerDocumentationChanged.bind(this) )
        this.selectedTagsModel.onValueChanged( this.onSelectedTagsChanged.bind(this) )
    }

    onMethodSelectionChanged({ oldValue: oldValue, newValue: newValue }) {
        this.selectedMethodModel.setValue( newValue )
    }

    triggerDocumentationChanged() {
        this.documentationChangedModel.triggerValueChanged({ oldValue: undefined, newValue: undefined })
    }

    onSelectedTagsChanged() {
        const selectedTags = this.selectedTagsModel.getValue()

        const methodsWithSelectedTags = this.getMethodDefinitionsFilteredByTags({
            tagsFilter: selectedTags,
        })

        this.classMethodsModel.setChoices( methodsWithSelectedTags )
    }

    getMethodDefinitionsFilteredByTags({ tagsFilter: tagsFilter }) {
        const methodDefinitions = this.classDefinition.getMethods()

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
}

module.exports = Classification.define(ClassDocumentationBrowserModel)