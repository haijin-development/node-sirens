const TreeChoiceModel = require('../../models/TreeChoiceModel')
const ValueModel = require('../../models/ValueModel')
const InstanceVariable = require('../objects/InstanceVariable')

class ObjectBrowserModel {
    /// Initializing

    constructor(inspectedObject) {
        this.inspectedObject = inspectedObject

        this.objectInstanceVariablesTree = new TreeChoiceModel({
            roots: this.getInstanceVariablesRootsFrom(inspectedObject),
            getChildrenBlock: this._getChildInstanceVariablesOf.bind(this),
        })

        this.selectedInstanceVariableText = new ValueModel()

        this.connectModels()
    }

    getInstanceVariablesRootsFrom(inspectedObject) {
        const root = new InstanceVariable({key: null, value: inspectedObject})

        return [root]
    }

    connectModels() {
        this.objectInstanceVariablesTree.getValue().on(
            'value-changed',
            this.onInstVarSelectionChanged.bind(this)
        )
    }

    /// Accessing

    getRootObject() {
        return this.objectInstanceVariablesTree.getRoots()[0].getValue()
    }

    getObjectInstanceVariablesTree() {
        return this.objectInstanceVariablesTree
    }

    getSelectedInstanceVariableValue() {
        return this.objectInstanceVariablesTree.getSelectionValue()
    }

    getSelectedInstanceVariableText() {
        return this.selectedInstanceVariableText
    }

    _getChildInstanceVariablesOf(instanceVariable) {
        return instanceVariable.getChildInstanceVariables()
    }

    /// Events

    onInstVarSelectionChanged() {
        const selectedValueString = this.selectedValueString()

        this.selectedInstanceVariableText.setValue(selectedValueString)
    }

    /// Displaying

    selectedValueString() {
        const selectedInstVarValue = this.getSelectedInstanceVariableValue()

        if (typeof selectedInstVarValue == 'function') {
            return selectedInstVarValue.toString()
        }

        try {
            return JSON.stringify(selectedInstVarValue)
        } catch(error) {
            return selectedInstVarValue.toString()
        }
    }
}

module.exports = ObjectBrowserModel