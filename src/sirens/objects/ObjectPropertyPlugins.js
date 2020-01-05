const Classification = require('../../O').Classification
const ObjectWithNamespace = require('../../O').ObjectWithNamespace
const PropertyValueToText = require('./ObjectProperty')

/*
    Class(`
        An ObjectProperty displays the properties and values of an object.
        It selects the object properties to display and its display format.

        Some applications may want to extend or modify which properties to show
        and how to display them.

        This ObjectPropertyPlugins object eases the customization by allowing
        to register additional classification to attach to every ObjectProperty
        created.
    `)
*/
class ObjectPropertyPlugins {
    /// Definition

    static definition() {
        this.instanceVariables = ['plugins']
        this.assumes = [ObjectWithNamespace]
    }

    /// Initializing

    initialize() {
        this.plugins = []
    }

    addPlugin(classification) {
        this.plugins.push( classification )
    }

    newObjectProperty({ key: key, value: value }) {
        const objectProperty = this.namespace().ObjectProperty.new({
            key: key,
            value: value
        })

        this.attachPluginClassificationsTo({ objectProperty: objectProperty })

        return objectProperty
    }

    attachPluginClassificationsTo({ objectProperty: objectProperty }) {
        for( const eachPluginClassification of this.plugins ) {
            objectProperty.behaveAs( eachPluginClassification )
        }        
    }
}

module.exports = Classification.define(ObjectPropertyPlugins)
