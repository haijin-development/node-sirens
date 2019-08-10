const TreeChoiceModel = require('../../gui/models/TreeChoiceModel')
const ValueModel = require('../../gui/models/ValueModel')
const ChoiceModel = require('../../gui/models/ChoiceModel')
const callsites = require('callsites')
const FunctionDefinition = require('../objects/FunctionDefinition')
const ObjectProperty = require('../objects/ObjectProperty')

class StackTraceBrowserModel {
    /// Initializing

    constructor({framesStack: framesStack, object: object}) {
        this.framesStackModel = new ChoiceModel({
            choices: framesStack
        })

        this.objectPropertiesTree = new TreeChoiceModel({
            roots: this.getRootPropertiesFrom(object),
            getChildrenBlock: (objectProperty) => { return objectProperty.getChildProperties() },
        })

        this.functionSourceCode = new ValueModel()

        this.connectModels()
    }

    getRootPropertiesFrom(object) {
        const objectProperty = new ObjectProperty({key: null, value: object})

        return [objectProperty]
    }

    connectModels() {
        this.framesStackModel.getValue().on(
            'value-changed',
            this.onStackFrameSelectionChanged.bind(this)
        )        
    }

    /// Accessing

    getFramesStackModel() {
        return this.framesStackModel
    }

    getFunctionSourceCodeModel() {
        return this.functionSourceCode
    }

    getSelectedStackFrame() {
        return this.framesStackModel.getSelection()
    }

    getObjectPropertiesTree() {
        return this.objectPropertiesTree
    }

    getSelectedPropertyValue() {
        return this.objectPropertiesTree.getSelectionValue()
    }

    /// Events

    onStackFrameSelectionChanged() {
        const selectedStackFrame = this.getSelectedStackFrame()

        const functionDefinition = this.getFunctionDefinitionFrom(selectedStackFrame)

        const functionSourceCode = functionDefinition.getOriginalSourceCode({cr: "\r"})

        this.functionSourceCode.setValue(functionSourceCode)
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

module.exports = StackTraceBrowserModel