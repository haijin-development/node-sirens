const Classification = require('../../o-language/classifications/Classification')
const TreeChoiceModel = require('../../gui/models/TreeChoiceModel')
const ValueModel = require('../../gui/models/ValueModel')
const ChoiceModel = require('../../gui/models/ChoiceModel')
const callsites = require('callsites')
const FunctionDefinition = require('../objects/FunctionDefinition')
const ObjectProperty = require('../objects/ObjectProperty')

const StackTraceBrowserModel = Classification.define( class {
    /// Definition

    static definition() {
        this.instanceVariables = ['framesStackModel', 'objectPropertiesTree', 'functionSourceCode']
    }

    /// Initializing

    initialize({ framesStack: framesStack, object: object }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.framesStackModel = ChoiceModel.new({
            choices: framesStack
        })

        this.objectPropertiesTree = TreeChoiceModel.new({
            roots: this.getRootPropertiesFrom(object),
            getChildrenBlock: (objectProperty) => { return objectProperty.getChildProperties() },
        })

        this.functionSourceCode = ValueModel.new()

        this.connectModels()
    }

    getRootPropertiesFrom(object) {
        const objectProperty = ObjectProperty.new({ key: null, value: object })

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
    
})

module.exports = StackTraceBrowserModel