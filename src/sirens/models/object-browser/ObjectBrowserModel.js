const Classification = require('../../../O').Classification
const ModelObject = require('../../../Skins').ModelObject
const ObjectPropertiesModel = require('./ObjectPropertiesModel')
const Pluggables = require('../../objects/Pluggables')

class ObjectBrowserModel {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ModelObject]
    }

    /// Building

    buildWith(modelBuilder) {
        modelBuilder.build( function(appModel) {

            this.whenObjectChanges( ({ newValue: object }) => {
                appModel.getChild({ id: 'objectProperties' }).setObject( object )
            })

            this.object({
                id: 'objectProperties',
                definedWith: ObjectPropertiesModel.new({
                    whenSelectionChanges: function({ selection: objectProperty }) {
                        const value = objectProperty.getValue()
                        appModel.getChild({ id: 'playground' }).setObject( value )
                    }
                }),
            })

            this.objectAttributeValue({
                id: 'playground',
                attributeReader: (selectedValue) => { 
                    return appModel.propertySelectionValueStringFrom({ value: selectedValue })
                },
            })

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

module.exports = Classification.define(ObjectBrowserModel)
