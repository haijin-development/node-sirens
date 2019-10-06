const Classification = require('../../o-language/classifications/Classification')
const TreeChoiceModel = require('../../gui/models/TreeChoiceModel')
const BufferedAttributeModel = require('../../gui/models/BufferedAttributeModel')
const ChoiceModel = require('../../gui/models/ChoiceModel')
const callsites = require('callsites')
const FunctionDefinition = require('../objects/source-code/FunctionDefinition')
const ObjectProperty = require('../objects/ObjectProperty')

class StackTraceBrowserModel {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'framesStackModel', 'objectPropertiesTreeModel', 'functionSourceCodeModel'
        ]
    }

    /// Initializing

    initialize({ framesStack: framesStack, object: object }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.framesStackModel = ChoiceModel.new({
            choices: framesStack
        })

        this.objectPropertiesTreeModel = TreeChoiceModel.new({
            roots: this.getRootPropertiesFrom(object),
            getChildrenBlock: (objectProperty) => { return objectProperty.getChildProperties() },
        })

        this.functionSourceCodeModel = BufferedAttributeModel.new({
            attributeReader: this.getFunctionSourceCode.bind(this)
        })

        this.connectModels()
    }

    getRootPropertiesFrom(object) {
        const objectProperty = ObjectProperty.new({ key: null, value: object })

        return [objectProperty]
    }

    connectModels() {
        this.framesStackModel.onSelectionChanged(
            this.onStackFrameSelectionChanged.bind(this)
        )        
    }

    /// Accessing

    getFramesStackModel() {
        return this.framesStackModel
    }

    getFunctionSourceCodeModel() {
        return this.functionSourceCodeModel
    }

    getSelectedStackFrame() {
        return this.framesStackModel.getSelectionValue()
    }

    getObjectPropertiesTreeModel() {
        return this.objectPropertiesTreeModel
    }

    getSelectedPropertyValue() {
        return this.objectPropertiesTreeModel.getSelectionValue()
    }

    /// Formatting

    getFunctionSourceCode(functionDefinition) {
        if( functionDefinition === undefined ) { return '' }

        return functionDefinition.getFunctionSourceCode()
    }

    /// Events

    onStackFrameSelectionChanged() {
        const selectedStackFrame = this.getSelectedStackFrame()

        const functionDefinition = this.getFunctionDefinitionFrom(selectedStackFrame)

        this.functionSourceCodeModel.setObject(functionDefinition)
    }

    getFunctionDefinitionFrom(stackFrame) {
        return FunctionDefinition.from({
            file: stackFrame.getFileName(),
            line: stackFrame.getLineNumber(),
            colum: stackFrame.getColumnNumber(),
        })
    }

    /// Displaying
    
}

module.exports = Classification.define(StackTraceBrowserModel)
