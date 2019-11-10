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

        this.connectModels()
    }

    /// Accessing

    getClassDefinition() {
        return this.classDefinition
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

    /// Querying

    getClassName() {
        return this.classDefinition.getClassName() + ' class'
    }

    getSelectedMethodName() {
        const method = this.classMethodsModel.getSelectionValue()

        if( method === undefined || method === null ) { return null }

        return method.getName()
    }


    /// Formatting

    getHeaderSourceCode(headerDefinition) {
        return headerDefinition.getSourceCode()
    }

    getMethodSourceCode(selectedMethod) {
        if( selectedMethod === null ) { return '' }

        return selectedMethod.getFunctionFormattedSourceCode()
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