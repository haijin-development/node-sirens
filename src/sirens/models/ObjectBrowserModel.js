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
        const selectedInstVarValue = this.objectInstanceVariablesTree.getSelectionValue()

        const selectedValueString = JSON.stringify(selectedInstVarValue)

        this.selectedInstanceVariableText.setValue(selectedValueString)
    }

}

module.exports = ObjectBrowserModel