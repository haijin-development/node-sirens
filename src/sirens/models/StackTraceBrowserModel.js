const TreeChoiceModel = require('../../gui/models/TreeChoiceModel')
const ValueModel = require('../../gui/models/ValueModel')
const ChoiceModel = require('../../gui/models/ChoiceModel')
const callsites = require('callsites')
const FunctionDefinition = require('../objects/FunctionDefinition')

class StackTraceBrowserModel {
    /// Initializing

    constructor(framesStack) {
        this.framesStackModel = new ChoiceModel({
            choices: framesStack
        })

        this.functionSourceCode = new ValueModel()

        this.connectModels()
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

    /// Events

    onStackFrameSelectionChanged() {
        const selectedStackFrame = this.getSelectedStackFrame()

        const functionDefinition = this.getFunctionDefinitionFrom(selectedStackFrame)

        this.functionSourceCode.setValue(functionDefinition.toSourceCode())
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