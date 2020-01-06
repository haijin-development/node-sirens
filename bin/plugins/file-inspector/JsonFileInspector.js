const JsonStructureParser = require('./JsonFileInspector/JsonStructureParser')
const JsonContentInspectorFlow = require('./JsonFileInspector/JsonContentInspectorFlow')

const JsonFileInspector = {
    parser: {
        fileType: '.json',
        parser: JsonStructureParser,
    },
    content: {
        contentType: 'jsonContent',
        fileInspectorFlow: JsonContentInspectorFlow,
    }
}

module.exports = JsonFileInspector