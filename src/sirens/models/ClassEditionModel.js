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
            object: classDefinition.getHeaderDefinition(), 
            attributeReader: this.getHeaderSourceCode.bind(this),
        })

        this.classMethodsModel = ChoiceModel.new({
            choices: classDefinition.getFunctionDefinitions(),
            selection: undefined,
        })

        this.selectedMethodSourceCodeModel = BufferedAttributeModel.new({
            attributeReader: this.getMethodSourceCode.bind(this),
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
        this.classMethodsModel.getSelectionModel().on(
            'value-changed',
            this.onSelectedMethodChanged.bind(this)
        )
    }

    onSelectedMethodChanged({ oldValue: oldMethod, newValue: selectedMethod }) {
        this.selectedMethodSourceCodeModel.setObject( selectedMethod )
    }
}

module.exports = Classification.define(ClassEditionModel)