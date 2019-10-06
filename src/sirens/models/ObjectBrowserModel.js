const Classification = require('../../o-language/classifications/Classification')
const TreeChoiceModel = require('../../gui/models/TreeChoiceModel')
const ValueModel = require('../../gui/models/ValueModel')
const ObjectProperty = require('../objects/ObjectProperty')

class ObjectBrowserModel {
    /// Definition

    static definition() {
        this.instanceVariables = [
            'inspectedObject', 'objectPropertiesTreeModel', 'selectedObjectTextModel'
        ]
    }

    /// Initializing

    initialize({ object: inspectedObject }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.inspectedObject = inspectedObject

        this.objectPropertiesTreeModel = TreeChoiceModel.new({
            roots: this.getRootPropertiesFrom(inspectedObject),
            getChildrenBlock: (objectProperty) => { return objectProperty.getChildProperties() },
        })

        this.selectedObjectTextModel = ValueModel.new()

        this.connectModels()
    }

    getRootPropertiesFrom(inspectedObject) {
        const root = ObjectProperty.new({ key: null, value: inspectedObject })

        return [root]
    }

    connectModels() {
        this.objectPropertiesTreeModel.onSelectionChanged(
            this.onInstVarSelectionChanged.bind(this)
        )
    }

    /// Accessing

    getRootObject() {
        return this.objectPropertiesTreeModel.getRoots()[0].getValue()
    }

    getObjectPropertiesTreeModel() {
        return this.objectPropertiesTreeModel
    }

    getSelectedPropertyValue() {
        return this.objectPropertiesTreeModel.getSelectionValue()
    }

    getSelectedPropertyTextModel() {
        return this.selectedObjectTextModel
    }

    /// Events

    onInstVarSelectionChanged() {
        const selectedValueString = this.selectedValueString()

        this.selectedObjectTextModel.setValue(selectedValueString)
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
