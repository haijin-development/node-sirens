// review in the next iteration

const OInstanceObjectProperty = require('./objects/OInstanceObjectProperty')

const DocumentationDsl = require('./objects/documentation/documentationDsl/DocumentationDsl')
const PropertyValueToPlaygroundText = require('./objects/value-displayers/PropertyValueToPlaygroundText')


const Pluggables = {

    objectPropertiesInspector: {
        availablePropertiesInspectors: [
            OInstanceObjectProperty
        ],
 
        playgroundTextConverter: PropertyValueToPlaygroundText,
    },

    documentationFormats: {
        default: DocumentationDsl,

        available: [
            DocumentationDsl,
        ],
    },
}

module.exports = Pluggables
