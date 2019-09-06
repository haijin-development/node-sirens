const Classification = require('../../o-language/classifications/Classification')
const TreeChoiceModel = require('../../gui/models/TreeChoiceModel')
const ValueModel = require('../../gui/models/ValueModel')
const ChoiceModel = require('../../gui/models/ChoiceModel')
const callsites = require('callsites')
const FunctionDefinition = require('../objects/js-statements/FunctionDefinition')
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

        this.functionSourceCodeModel = ValueModel.new()

        this.connectModels()
    }

    getRootPropertiesFrom(object) {
        const objectProperty = ObjectProperty.new({ key: null, value: object })

        return [objectProperty]
    }

    connectModels() {
        this.framesStackModel.getSelectionModel().on(
            'value-changed',
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

    /// Events

    onStackFrameSelectionChanged() {
        const selectedStackFrame = this.getSelectedStackFrame()

        const functionDefinition = this.getFunctionDefinitionFrom(selectedStackFrame)

        const functionSourceCodeModel = functionDefinition.getSourceCode({cr: "\r"})

        this.functionSourceCodeModel.setValue(functionSourceCodeModel)
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
