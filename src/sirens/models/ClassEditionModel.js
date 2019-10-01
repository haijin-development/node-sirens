const Classification = require('../../o-language/classifications/Classification')
const ChoiceModel = require('../../gui/models/ChoiceModel')
const BufferedAttributeModel = require('../../gui/models/BufferedAttributeModel')

class ClassEditionModel {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'classDefinition',
            'headerSourceCodeModel',
            'classMethodsModel',
            'selectedMethodSourceCodeModel',
            'classCommentModel',
        ]
    }

    /// Initializing

    initialize({ classDefinition: classDefinition }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.classDefinition = classDefinition

        this.headerSourceCodeModel = BufferedAttributeModel.new({
            object: classDefinition.getHeader(),
            attributeReader: this.getHeaderSourceCode.bind(this),
        })

        this.classMethodsModel = ChoiceModel.new({
            choices: classDefinition.getMethods(),
            selection: undefined,
        })

        this.selectedMethodSourceCodeModel = BufferedAttributeModel.new({
            attributeReader: this.getMethodSourceCode.bind(this),
        })

        this.classCommentModel = BufferedAttributeModel.new({
            object: classDefinition.getComment(),
            attributeReader: (comment) => { return comment.getString() },
        })

        this.connectModels()
    }

    /// Accessing

    getClassName() {
        return this.classDefinition.getClassName() + ' class'
    }

    getHeaderSourceCodeModel() {
        return this.headerSourceCodeModel
    }

    getClassMethodsModel() {
        return this.classMethodsModel
    }

    getSelectedMethodSourceCodeModel() {
        return this.selectedMethodSourceCodeModel
    }

    getClassCommentModel() {
        return this.classCommentModel
    }

    /// Formatting

    getHeaderSourceCode(headerDefinition) {
        return headerDefinition.getSourceCode()
    }

    getMethodSourceCode(selectedMethod) {
        if( selectedMethod === undefined ) { return '' }

        return selectedMethod.getFormattedSourceCode()
    }

    /// Events

    connectModels() {
        this.classMethodsModel.onSelectionChanged(
            this.onSelectedMethodChanged.bind(this)
        )
    }

    onSelectedMethodChanged({ oldValue: oldMethod, newValue: selectedMethod }) {
        this.selectedMethodSourceCodeModel.setObject( selectedMethod )
    }
}

module.exports = Classification.define(ClassEditionModel)