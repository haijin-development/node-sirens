const Classification = require('../../../O').Classification
const FlowModel = require('../../../Skins').FlowModel

class ObjectPropertiesFlow {
    /// Definition

    static definition() {
        this.instanceVariables = ['selectionChangedClosure']
        this.assumes = [FlowModel]
    }

    /// Initializing

    initialize({ whenSelectionChanges: selectionChangedClosure }) {
        this.selectionChangedClosure = selectionChangedClosure

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    /// Building

    buildWith(flow) {
        const selectionChangedClosure = this.selectionChangedClosure

        flow.main( function(objectProperties) {

            this.whenObjectChanges( ({ newValue: object }) => {
                const rootProperties = objectProperties.getRootProperties()
                objectProperties.getChild({ id: 'properties' }).setRoots({ items: rootProperties })
            })

            this.treeChoice({
                id: 'properties',
                roots: objectProperties.getRootProperties(),
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

module.exports = Classification.define(ObjectPropertiesFlow)
