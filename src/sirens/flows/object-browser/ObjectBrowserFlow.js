const Classification = require('../../../O').Classification
const ValueFlow = require('../../../finger-tips/flows/ValueFlow')
const ObjectPropertiesFlow = require('./ObjectPropertiesFlow')
const Pluggables = require('../../objects/Pluggables')

class ObjectBrowserFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ValueFlow]
    }

    /// Building

    buildWith(flow) {
        flow.main({ id: 'objectBrowser' }, function(thisFlow) {

            this.defineFlowCommandsIn({ method: thisFlow.flowMethods })

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
                    return thisFlow.executeCommand({
                        id: 'propertySelectionValueStringFrom',
                        with: { value: selectedValue },
                    })
                },
            })

            thisFlow.evaluateEventHandler({ event: 'application-flow-built', eventHandler: () => {} })
        })
    }

    /// Flow methods

    flowMethods(thisFlow) {
        this.category( 'flow methods', () => {
            const methods = [
                'browseObject',
                'propertySelectionValueStringFrom',
            ]

            this.defineCommandMethods({ methodNames: methods })
        })
    }

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
