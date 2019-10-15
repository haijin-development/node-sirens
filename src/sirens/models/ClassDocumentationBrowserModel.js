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
        ]
    }


    /// Initializing

    initialize({ classDefinition: classDefinition }) {
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

        this.connectModels()
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

    showsUnformattedComments() {
        return this.showUnformattedCommentsModel.getValue() === true
    }

    isInEditionMode() {
        return this.editionModeModel.getValue() === true
    }

    getClassDefinition() {
        return this.classDefinition
    }

    getClassName() {
        return this.classDefinition.getClassName()
    }

    getClassMethodsModel() {
        return this.classMethodsModel
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


    getSelectedMethodModel() {
        return this.selectedMethodModel
    }

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
    }

    onMethodSelectionChanged({ oldValue: oldValue, newValue: newValue }) {
        this.selectedMethodModel.setValue( newValue )
    }

    triggerDocumentationChanged() {
        this.documentationChangedModel.triggerValueChanged({ oldValue: undefined, newValue: undefined })
    }
}

module.exports = Classification.define(ClassDocumentationBrowserModel)
