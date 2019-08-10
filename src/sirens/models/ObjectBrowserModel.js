const TreeChoiceModel = require('../../gui/models/TreeChoiceModel')
const ValueModel = require('../../gui/models/ValueModel')
const ObjectProperty = require('../objects/ObjectProperty')

class ObjectBrowserModel {
    /// Initializing

    constructor(inspectedObject) {
        this.inspectedObject = inspectedObject

        this.objectPropertiesTree = new TreeChoiceModel({
            roots: this.getRootPropertiesFrom(inspectedObject),
            getChildrenBlock: (objectProperty) => { return objectProperty.getChildProperties() },
        })

        this.selectedObjectText = new ValueModel()

        this.connectModels()
    }

    getRootPropertiesFrom(inspectedObject) {
        const root = new ObjectProperty({key: null, value: inspectedObject})

        return [root]
    }

    connectModels() {
        this.objectPropertiesTree.getValue().on(
            'value-changed',
            this.onInstVarSelectionChanged.bind(this)
        )
    }

    /// Accessing

    getRootObject() {
        return this.objectPropertiesTree.getRoots()[0].getValue()
    }

    getObjectPropertiesTree() {
        return this.objectPropertiesTree
    }

    getSelectedPropertyValue() {
        return this.objectPropertiesTree.getSelectionValue()
    }

    getSelectedPropertyText() {
        return this.selectedObjectText
    }

    /// Events

    onInstVarSelectionChanged() {
        const selectedValueString = this.selectedValueString()

        this.selectedObjectText.setValue(selectedValueString)
    }

    /// Displaying

    selectedValueString() {
        const selectedInstVarValue = this.getSelectedPropertyValue()

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