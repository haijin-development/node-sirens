const TreeChoiceModel = require('../../models/TreeChoiceModel')
const ValueModel = require('../../models/ValueModel')
const ChoiceModel = require('../../models/ChoiceModel')
const callsites = require('callsites')

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

    }

    getSelectedStackFrame() {
        return this.framesStackModel.getSelection()
    }

    /// Events

    onStackFrameSelectionChanged() {
        const selectedStackFrame = this.getSelectedStackFrame()

        this.functionSourceCode.setValue(selectedStackFrame.toString())
    }

    /// Displaying
    
}

module.exports = StackTraceBrowserModel