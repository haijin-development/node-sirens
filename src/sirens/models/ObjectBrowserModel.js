const Classification = require('../../o-language/classifications/Classification')
const TreeChoiceModel = require('../../gui/models/TreeChoiceModel')
const ValueModel = require('../../gui/models/ValueModel')
const ObjectProperty = require('../objects/ObjectProperty')
const Preferences = require('../objects/Preferences')

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

        root.behaveAsAll( Preferences.objectPropertiesInspectorPlugins )

        return [root]
    }

    connectModels() {
        this.objectPropertiesTreeModel.onSelectionChanged(
            this.onInstVarSelectionChanged.bind(this)
        )
    }

    /// Accessing

    getObjectPropertiesTreeModel() {
        return this.objectPropertiesTreeModel
    }

    getSelectedPropertyTextModel() {
        return this.selectedObjectTextModel
    }

    /// Querying

    getRootObject() {
        return this.objectPropertiesTreeModel.getRoots()[0].getValue()
    }

    getSelectedInstVarProperty() {
        return this.objectPropertiesTreeModel.getSelectionValue()
    }

    getSelectedPropertyValue() {
        const instVarProperty =this.getSelectedInstVarProperty() 

        if( instVarProperty === null ) { return null }

        return instVarProperty.getValue()
    }

    /// Events

    onInstVarSelectionChanged() {
        const selectedValueString = this.selectedValueString()

        this.selectedObjectTextModel.setValue(selectedValueString)
    }

    /// Displaying

    selectedValueString() {
        const selectedInstVarValue = this.getSelectedPropertyValue()

        if( selectedInstVarValue === null ) {
            return ''
        }

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
