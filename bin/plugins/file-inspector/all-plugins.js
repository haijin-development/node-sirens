const JSFileStructureParser = require('./JsFileParser/JSFileStructureParser')

const JsonStructureParser = require('./JsonFileInspector/JsonStructureParser')
const JsonContentInspectorFlow = require('./JsonFileInspector/JsonContentInspectorFlow')

const YamlStructureParser = require('./YamlFileInspector/YamlStructureParser')
const YamlContentInspectorFlow = require('./YamlFileInspector/YamlContentInspectorFlow')

const allPulings = [
    {
        parser: {
            fileType: '.json',
            parser: JsonStructureParser,
        },
        content: {
            contentType: 'jsonContent',
            fileInspectorFlow: JsonContentInspectorFlow,
        }
    },

    {
        parser: {
            fileType: '.yml',
            parser: YamlStructureParser,
        },
        content: {
            contentType: 'yamlContent',
            fileInspectorFlow: YamlContentInspectorFlow,
        }
    },

    {
        parser: {
            fileType: '.js',
            parser: JSFileStructureParser,
        },
    },
]

module.exports = allPulings