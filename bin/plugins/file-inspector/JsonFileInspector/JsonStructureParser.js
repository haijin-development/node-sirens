const Classification = require('../../../../src/O').Classification
const ObjectWithNamespace = require('../../../../src/O').ObjectWithNamespace
const JsonContent = require('./JsonContent')

class JsonStructureParser {

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectWithNamespace]
    }

    /// Parsing

    parse({ sourceFile: sourceFile }) {
        const fileContents = sourceFile.readFileContents()

        const file = this.namespace().FileObject.new()

        file.setFileLocation({
            sourceFile: sourceFile,
            startPos: 0,
            endPos: 'eof',
        })

        const jsonContent = this.createJsonContent({
            sourceFile: sourceFile,
            fileContents: fileContents,
        }) 

        file.addChildObject(jsonContent)

        return file
    }

    createJsonContent({
        sourceFile: sourceFile,
        fileContents: fileContents,
    }) {
        const jsonObject = JSON.parse(fileContents)

        const jsonContent = JsonContent.new()

        jsonContent.setNamespace( this.namespace() )

        jsonContent.setFileLocation({
            sourceFile: sourceFile,
            startPos: 0,
            endPos: 'eof',
       })

        jsonContent.setJsonObject({ jsonObject: jsonObject })

        return jsonContent
    }
}

module.exports = Classification.define(JsonStructureParser)
