const OInstanceObjectProperty = require('./OInstanceObjectProperty')
const DocumentationDsl = require('./documentation/documentationDsl/DocumentationDsl')
const PropertyValueToPlaygroundText = require('./value-displayers/PropertyValueToPlaygroundText')
const TextualContentInspectorFlow = require('../flows/file-object-inspectors/TextualContentInspectorFlow')
const JsClassInspectorFlow = require('../flows/file-object-inspectors/JsClassInspectorFlow')

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

Pluggables.fileObjectInspectorFlows = {
    default: TextualContentInspectorFlow,
    'jsClass': JsClassInspectorFlow,
}

module.exports = Pluggables
