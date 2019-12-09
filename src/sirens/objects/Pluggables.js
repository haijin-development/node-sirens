const OInstanceObjectProperty = require('./OInstanceObjectProperty')
const DocumentationDsl = require('./documentation/documentationDsl/DocumentationDsl')
const PropertyValueToPlaygroundText = require('./value-displayers/PropertyValueToPlaygroundText')
const TextualContentComponent = require('../components/file-editor/TextualContentComponent')
const JsClassComponent = require('../components/file-editor/JsClassComponent')

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

Pluggables.fileInspectorComponents = {
    default: TextualContentComponent,
    'jsClass': JsClassComponent,
}

module.exports = Pluggables
