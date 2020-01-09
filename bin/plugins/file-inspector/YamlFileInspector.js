const YamlStructureParser = require('./YamlFileInspector/YamlStructureParser')
const YamlContentInspectorFlow = require('./YamlFileInspector/YamlContentInspectorFlow')

const YamlFileInspector = {
    parser: {
        fileType: '.yml',
        parser: YamlStructureParser,
    },
    content: {
        contentType: 'yamlContent',
        fileInspectorFlow: YamlContentInspectorFlow,
    }
}

module.exports = YamlFileInspector