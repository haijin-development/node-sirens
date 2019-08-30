const Classification = require('../../o-language/classifications/Classification')
const TreeChoiceModel = require('../../gui/models/TreeChoiceModel')
const ValueModel = require('../../gui/models/ValueModel')
const ObjectProperty = require('../objects/ObjectProperty')

class ObjectBrowserModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['inspectedObject', 'objectPropertiesTree', 'selectedObjectText']
    }

    /// Initializing

    initialize({ object: inspectedObject }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.inspectedObject = inspectedObject

        this.objectPropertiesTree = TreeChoiceModel.new({
            roots: this.getRootPropertiesFrom(inspectedObject),
            getChildrenBlock: (objectProperty) => { return objectProperty.getChildProperties() },
        })

        this.selectedObjectText = ValueModel.new()

        this.connectModels()
    }

    getRootPropertiesFrom(inspectedObject) {
        const root = ObjectProperty.new({ key: null, value: inspectedObject })

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

module.exports = Classification.define(ObjectBrowserModel)
