const Classification = require('../../../O').Classification
const FlowModel = require('../../../Skins').FlowModel
const ObjectPropertiesFlow = require('./ObjectPropertiesFlow')
const Pluggables = require('../../objects/Pluggables')

class ObjectBrowserFlow {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FlowModel]
    }

    /// Building

    buildWith(flow) {
        flow.main( function(application) {

            this.whenObjectChanges( ({ newValue: object }) => {
                application.getChild({ id: 'objectProperties' }).setObject( object )
            })

            this.object({
                id: 'objectProperties',
                definedWith: ObjectPropertiesFlow.new({
                    whenSelectionChanges: function({ selection: objectProperty }) {
                        const value = objectProperty.getValue()
                        application.getChild({ id: 'playground' }).setObject( value )
                    }
                }),
            })

            this.objectAttributeValue({
                id: 'playground',
                attributeReader: (selectedValue) => { 
                    return application.propertySelectionValueStringFrom({ value: selectedValue })
                },
            })

            this.notifyCommandsRouterOfEvent({ flowPointId: 'application', event: 'main-flow-built' })
        })
    }

    /// Actions

    browseObject(object) {
        this.setObject( object )
    }

    propertySelectionValueStringFrom({ value: value }) {
        const valueToTextClassification = Pluggables.objectPropertiesInspector.playgroundTextConverter

        const valueToText = valueToTextClassification.new()

        return valueToText.getDisplayValueFrom({ value: value })
    }
}

module.exports = Classification.define(ObjectBrowserFlow)
