const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const Sirens = require('../../../Sirens')

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

            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })

            this.whenObjectChanges( ({ newValue: object }) => {
                const rootProperties = thisFlow.getRootProperties()

                thisFlow.getChildFlow({ id: 'properties' }).setRoots({ items: rootProperties })
            })

            this.treeChoice({
                id: 'properties',
                roots: thisFlow.getRootProperties(),
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

    flowCommands(thisFlow) {
        this.commandsGroup({ id: 'flow-commands' }, function() {

            this.statelessCommands({
                definedInFlow: thisFlow,
                withMethods: [
                    'inspectSelectedObject',
                    'browseSelectedObjectPrototypes',
                    'getMainObject',
                    'getRootProperties',
                    'getSelectedPropertyValue',
                ],
            })

        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'flow-commands.inspectSelectedObject',
            'flow-commands.browseSelectedObjectPrototypes',
            'flow-commands.getMainObject',
            'flow-commands.getRootProperties',
            'flow-commands.getSelectedPropertyValue',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    /// Querying

    inspectSelectedObject() {
        const selectedValue = this.getSelectedPropertyValue()

        Sirens.browseObject(selectedValue)
    }

    browseSelectedObjectPrototypes() {
        const selectedValue = this.getSelectedPropertyValue()

        Sirens.browsePrototypes(selectedValue)
    }

    getMainObject() {
        return this.getValue()
    }

    getRootProperties() {
        const rootObjectAsProperty = ObjectProperty.new({ key: null, value: this.getMainObject() })

        return [rootObjectAsProperty]
    }

    getSelectedPropertyValue() {
        const objectProperty = this.getChildFlow({ id: 'properties' }).getSelectionValue()

        return objectProperty ? objectProperty.getValue() : null
    }
}

module.exports = Classification.define(ObjectPropertiesFlow)
