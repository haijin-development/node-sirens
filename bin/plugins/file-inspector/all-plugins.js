const JsonStructureParser = require('./JsonFileInspector/JsonStructureParser')
const JsonContentInspectorFlow = require('./JsonFileInspector/JsonContentInspectorFlow')

const YamlStructureParser = require('./YamlFileInspector/YamlStructureParser')
const YamlContentInspectorFlow = require('./YamlFileInspector/YamlContentInspectorFlow')

const JsClassesAndMethodsParser = require('./JsClassesAndMethods/JsClassesAndMethodsParser')
const JsSpecParser = require('./JsSpec/JsSpecParser')
const SpecFileContentsInspectorFlow = require('./JsSpec/SpecFileContentsInspectorFlow')

const allPulings = [
    {
        name: 'Json Content',
        description: 'Recognizes .json files and displays the json object with an expandable tree',
        parser: JsonStructureParser,
        content: {
            contentType: 'jsonContent',
            fileInspectorFlow: JsonContentInspectorFlow,
        }
    },

    {
        name: 'Yaml Content',
        description: 'Recognizes .yml files and displays the json object with an expandable tree',
        parser: YamlStructureParser,
        content: {
            contentType: 'yamlContent',
            fileInspectorFlow: YamlContentInspectorFlow,
        }
    },

    {
        name: 'Specs',
        description: `Recognizes spec files and parses them to produce a tree of spec high level statements:
            before
            after
                description
                    before
                    after
                    it
                        before
                        after`,
        parser: JsSpecParser,
        content: {
            contentType: 'jsSpecFile',
            fileInspectorFlow: SpecFileContentsInspectorFlow,
        }
    },

    {
        name: 'Classes and methods',
        description: `Recognizes .js files and parses them to produce a tree of javascript high level statements:
            JsFile
                JsComment
                    ...
                JsClass
                    ...
                JsMethod
                    ...`,
        parser: JsClassesAndMethodsParser,
    },
]

module.exports = allPulings