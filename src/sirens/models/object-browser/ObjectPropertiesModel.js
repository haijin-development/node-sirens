const Classification = require('../../../O').Classification
const ModelObject = require('../../../Skins').ModelObject

class ObjectPropertiesModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['selectionChangedClosure']
        this.assumes = [ModelObject]
    }

    /// Initializing

    initialize({ whenSelectionChanges: selectionChangedClosure }) {
        this.selectionChangedClosure = selectionChangedClosure

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    /// Building

    buildWith(modelBuilder) {
        const selectionChangedClosure = this.selectionChangedClosure

        modelBuilder.build( function(objectPropertiesModel) {

            this.whenObjectChanges( ({ newValue: object }) => {
                const rootProperties = objectPropertiesModel.getRootProperties()
                objectPropertiesModel.getChild({ id: 'properties' }).setRoots({ items: rootProperties })
            })

            this.treeChoice({
                id: 'properties',
                roots: objectPropertiesModel.getRootProperties(),
                getChildrenClosure: function (objectProperty) {
                    return objectProperty.getChildProperties()
                },
                whenSelectionChanges: function({ newValue: selectedObjectProperties }) {
                    const selection = selectedObjectProperties[ selectedObjectProperties.length - 1 ]
                    selectionChangedClosure({ selection: selection })
                },
            })

        })
    }

    /// Querying

    getMainObject() {
        return this.getValue()
    }

    getRootProperties() {
        const rootObjectAsProperty = ObjectProperty.new({ key: null, value: this.getMainObject() })

        return [rootObjectAsProperty]
    }

    getSelectedPropertyValue() {
        const objectProperty = this.getChild({ id: 'properties' }).getSelectionValue()

        return objectProperty.getValue()
    }
}

module.exports = Classification.define(ObjectPropertiesModel)
