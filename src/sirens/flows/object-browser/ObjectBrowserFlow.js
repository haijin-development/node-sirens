const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/stateful-flows/ValueFlow')
const ObjectPropertiesFlow = require('./ObjectPropertiesFlow')

class ObjectBrowserFlow {
    /// Definition

    static definition() {
        this.instanceVariables = ['mainFlow']
        this.assumes = [ValueFlow]
    }

    initialize({ mainFlow: mainFlow }) {
        this.mainFlow = mainFlow

        this.previousClassificationDo( () => {
            this.initialize()
        })
    }

    bubbleUpCommandToMainFlow({ commandName: commandName, params: params }) {
        return this.mainFlow.executeCommand({
            id: commandName,
            withAll: params,
        })
    }

    mainNamespace() {
        return this.mainFlow.mainNamespace()
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'main' }, function(thisFlow) {

            this.defineMethodsAsCommands({
                methods: [
                    'setBrowsedObject',
                    'propertySelectionValueStringFrom',
                ],
            })

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


            this.acceptedBubbledUps({
                defaultHandler: function({ commandName: commandName, params: params }) {
                    return thisFlow.bubbleUpCommandToMainFlow({
                        commandName: commandName,
                        params: params
                    })
                }
            })

            thisFlow.evaluateEventHandler({ event: 'application-flow-built', eventHandler: () => {} })
        })
    }

    /// Exported commands

    attachCommandsToFlowPoint({ flowPoint: flowPoint }) {
        const exportedCommands = [
            'setBrowsedObject',
            'propertySelectionValueStringFrom',
        ]

        this.exportCommandsToFlowPoint({
            commandsIds: exportedCommands,
            flowPoint: flowPoint
        })
    }

    /// Flow methods

    setBrowsedObject(object) {
        this.setValue( object )
    }

    propertySelectionValueStringFrom({ value: value }) {
        const valueToTextConverter =
            this.mainNamespace().PropertyValueToPlaygroundText.new()

        return valueToTextConverter.getDisplayValueFrom({ value: value })
    }
}

module.exports = Classification.define(ObjectBrowserFlow)
