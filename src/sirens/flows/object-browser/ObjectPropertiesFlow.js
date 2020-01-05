const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/stateful-flows/ValueFlow')

class ObjectPropertiesFlow {
    /// Definition

    static definition() {
        this.instanceVariables = ['selectionChangedClosure']
        this.assumes = [ValueFlow]
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

        flow.main({ id: 'main' },  function(thisFlow) {

            this.defineMethodsAsCommands({
                methods: [
                    'inspectSelectedObject',
                    'browseSelectedObjectPrototypes',
                    'getMainObject',
                    'getRootProperties',
                    'getSelectedPropertyValue',
                ],
            })

            this.whenObjectChanges( ({ newValue: object }) => {
                const rootProperties = object ?
                    thisFlow.getRootProperties()
                    :
                    []

                thisFlow.getChildFlow({ id: 'properties' })
                    .setRoots({ items: rootProperties })
            })

            this.treeChoice({
                id: 'properties',
                roots: [],
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

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'inspectSelectedObject',
            'browseSelectedObjectPrototypes',
            'getMainObject',
            'getRootProperties',
            'getSelectedPropertyValue',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    /// Querying

    inspectSelectedObject() {
        const selectedValue = this.getSelectedPropertyValue()

        this.bubbleUp({
            command: 'browseObject',
            param: selectedValue
        })
    }

    browseSelectedObjectPrototypes() {
        const selectedValue = this.getSelectedPropertyValue()

        this.bubbleUp({
            command: 'browsePrototypes',
            param: selectedValue
        })
    }

    getMainObject() {
        return this.getValue()
    }

    getRootProperties() {
        const objectPropertyPlugins = this.mainNamespace().ObjectPropertyPlugins.new()

        const rootObjectAsProperty = objectPropertyPlugins.newObjectProperty({
            key: null,
            value: this.getMainObject()
        })

        return [rootObjectAsProperty]
    }

    getSelectedPropertyValue() {
        const objectProperty = this.getChildFlow({ id: 'properties' }).getSelectionValue()

        return objectProperty ? objectProperty.getValue() : null
    }

    mainNamespace() {
        return this.bubbleUp({ command: 'mainNamespace' })
    }
}

module.exports = Classification.define(ObjectPropertiesFlow)
