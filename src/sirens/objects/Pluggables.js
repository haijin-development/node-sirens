const OInstanceObjectProperty = require('./OInstanceObjectProperty')
const DocumentationDsl = require('./documentation/documentationDsl/DocumentationDsl')
const PropertyValueToPlaygroundText = require('./value-displayers/PropertyValueToPlaygroundText')

const Pluggables = {}

Pluggables.objectPropertiesInspector = {
    plugins: [ OInstanceObjectProperty ],
 
    playgroundTextConverter: PropertyValueToPlaygroundText,
}

Pluggables.documentationFormats = {
    default: DocumentationDsl,

    available: [
        DocumentationDsl,
    ],
}

module.exports = Pluggables
