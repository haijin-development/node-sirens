const TreeChoiceModel = require('../../models/TreeChoiceModel')
const ValueModel = require('../../models/ValueModel')
const InstanceVariable = require('./InstanceVariable')

class ObjectBrowserModel {
    /// Initializing

    constructor(inspectedObject) {
        this.inspectedObject = inspectedObject

        const root = new InstanceVariable({key: null, value: inspectedObject})

        this.objectInstanceVariablesTree = new TreeChoiceModel({
            roots: [root],
            getChildrenBlock: this._getChildInstanceVariablesOf.bind(this),
        })

        this.selectedInstanceVariableText = new ValueModel()

        this.connectModels()
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

    getSelectedInstanceVariables() {
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

    /// Dsiplaying

    selectedValueString() {
        const selectedInstVarValue = this.objectInstanceVariablesTree.getSelectionValue()

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