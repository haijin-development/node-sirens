const PlainTextStructureParser = require('./objects/file-structure-parsers/PlainTextStructureParser')
const JSFileStructureParser = require('./objects/file-structure-parsers/JSFileStructureParser')
const JsonStructureParser = require('./objects/file-structure-parsers/JsonStructureParser')

const OInstanceObjectProperty = require('./objects/OInstanceObjectProperty')

const DocumentationDsl = require('./objects/documentation/documentationDsl/DocumentationDsl')
const PropertyValueToPlaygroundText = require('./objects/value-displayers/PropertyValueToPlaygroundText')

const TextualContentInspectorFlow = require('./flows/file-object-inspectors/TextualContentInspectorFlow')
const JsClassInspectorFlow = require('./flows/file-object-inspectors/JsClassInspectorFlow')
const JsMethodInspectorFlow = require('./flows/file-object-inspectors/JsMethodInspectorFlow')
const JsonContentInspectorFlow = require('./flows/file-object-inspectors/JsonContentInspectorFlow')

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

    fileInspector: {
        fileTypeParsers: {
            default: PlainTextStructureParser,
            '.js': JSFileStructureParser,
            '.json': JsonStructureParser,
        },

        fileObjectInspectorFlows: {
            default: TextualContentInspectorFlow,
            jsClass: JsClassInspectorFlow,
            jsMethod: JsMethodInspectorFlow,
            jsonContent: JsonContentInspectorFlow,
        }
    },

}

module.exports = Pluggables
