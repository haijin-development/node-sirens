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

        flow.main({ id: 'objectProperties' },  function(thisFlow) {

            this.defineFlowCommandsIn({ method: thisFlow.flowMethods })
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

    flowMethods(thisFlow) {
        this.category( 'flow methods', () => {
            const methods = [
                'getMainObject',
                'getRootProperties',
                'getSelectedPropertyValue',
            ]

            this.defineCommandMethods({ methodNames: methods })
        })
    }

    flowCommands(thisFlow) {
        this.category( 'flow commands', () => {

            this.command({
                id: 'inspectSelectedObject',
                whenActioned: function() {
                    const selectedValue = thisFlow.getSelectedPropertyValue()

                    Sirens.browseObject(selectedValue)
                },
            })

            this.command({
                id: 'browseSelectedObjectPrototypes',
                whenActioned: function() {
                    const selectedValue = thisFlow.getSelectedPropertyValue()

                    Sirens.browsePrototypes(selectedValue)
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
        const objectProperty = this.getChildFlow({ id: 'properties' }).getSelectionValue()

        return objectProperty.getValue()
    }
}

module.exports = Classification.define(ObjectPropertiesFlow)
