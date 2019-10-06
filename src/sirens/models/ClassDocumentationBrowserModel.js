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

            'showUnformattedCommentsModel',

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

        this.showUnformattedCommentsModel = ValueModel.new({ value: false })

        this.classMethodsModel = ChoiceModel.new({
            choices: classDefinition.getMethods(),
            selection: undefined,
        })

        this.selectedMethodModel = ValueModel.new()

        this.connectModels()
    }

    /// Accessing

    getShowUnformattedCommentsModel() {
        return this.showUnformattedCommentsModel
    }

    showsUnformattedComments() {
        return this.showUnformattedCommentsModel.getValue() === true
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
        return this.classDefinition.getComment().getString()
    }

    getClassDocumentation() {
        const className = this.classDefinition.getClassName()

        const unformattedComment = this.getClassUnformattedComment()

        try {
            return ClassDocumentation.fromString( unformattedComment ).yourself( (documentation) => {
                documentation.setClassName( className )
            })
        } catch( e ) {
            return ClassDocumentation.new().yourself( (documentation) => {
                documentation.setClassName( className )
                documentation.setDescription( unformattedComment )
            })
        }
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

        const unformattedComment = method.getComment().getString()

        try {
            return MethodDocumentation.fromString( unformattedComment ).yourself( (documentation) => {
                documentation.setMethodName( method.getName() )
                documentation.setMethodParams( method.getParams() )
            })
        } catch( e ) {
            return MethodDocumentation.new().yourself( (documentation) => {
                documentation.setMethodName( method.getName() )
                documentation.setMethodParams( method.getParams() )
                documentation.setDescription( unformattedComment )
            })
        }    
    }

    /// Actions

    reload() {
        const value = this.showUnformattedCommentsModel.getValue()

        this.showUnformattedCommentsModel.triggerValueChanged({ oldValue: value, newValue: value })
    }

    /// Events

    connectModels() {
        this.classMethodsModel.onSelectionChanged( this.onMethodSelectionChanged.bind(this) )
    }

    onMethodSelectionChanged({ oldValue: oldValue, newValue: newValue }) {
        this.selectedMethodModel.setValue( newValue )
    }
}

module.exports = Classification.define(ClassDocumentationBrowserModel)
