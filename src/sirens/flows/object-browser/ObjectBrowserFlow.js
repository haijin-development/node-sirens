const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const ObjectPropertiesFlow = require('./ObjectPropertiesFlow')
const Pluggables = require('../../Pluggables')

class ObjectBrowserFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineFlowCommandsIn({ method: thisFlow.flowCommands })

            this.whenObjectChanges( ({ newValue: object }) => {
                thisFlow.getChildFlow({ id: 'objectProperties' }).setValue( object )
            })

            this.object({
                id: 'objectProperties',
                definedWith: ObjectPropertiesFlow.new({
                    whenSelectionChanges: function({ selection: objectProperty }) {
                        const value = objectProperty ? objectProperty.getValue() : null
                        thisFlow.getChildFlow({ id: 'playground' }).setObject( value )
                    }
                }),
            })

            this.bufferedValue({
                id: 'playground',
                convertToValueWith: ({ object: selectedValue }) => {
                    return thisFlow.propertySelectionValueStringFrom({ value: selectedValue })
                },
            })

            thisFlow.evaluateEventHandler({ event: 'application-flow-built', eventHandler: () => {} })
        })
    }

    flowCommands(thisFlow) {
        this.commandsGroup({ id: 'flow-commands' }, function() {

            this.statelessCommands({
                definedInFlow: thisFlow,
                withMethods: [
                    'browseObject',
                    'propertySelectionValueStringFrom',
                ],
            })

        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'flow-commands.browseObject',
            'flow-commands.propertySelectionValueStringFrom',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    /// Flow methods

    browseObject(object) {
        this.setValue( object )
    }

    propertySelectionValueStringFrom({ value: value }) {
        const valueToTextClassification =
            Pluggables.objectPropertiesInspector.playgroundTextConverter

        const valueToText = valueToTextClassification.new()

        return valueToText.getDisplayValueFrom({ value: value })
    }
}

module.exports = Classification.define(ObjectBrowserFlow)
