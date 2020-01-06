const splitLines = require('split-lines')
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
        const fileContents = sourceFile.getFileContents()

        const allLines = splitLines(fileContents)

        const lastLine = allLines[ allLines.length -1 ]

        const startLine = 1
        const startColumn = 0
        const endLine = allLines.length
        const endColumn = lastLine.length

        const jsonContent = this.createJsonContent({
            sourceFile: sourceFile,
            startLine: 1,
            startColumn: 0,
            endLine: allLines.length,
            endColumn: lastLine.length,
            fileContents: fileContents,
        }) 

        const file = this.createFileObject({
            sourceFile: sourceFile,
            startLine: 1,
            startColumn: 0,
            endLine: allLines.length,
            endColumn: lastLine.length,
        }) 

        file.addChildObject(jsonContent)

        return file
    }

    createJsonContent({
        sourceFile: sourceFile,
        startLine: startLine,
        startColumn: startColumn,
        endLine: endLine,
        endColumn: endColumn,
        fileContents: fileContents,
    }) {
        const jsonContent = JsonContent.new()

        jsonContent.setNamespace( this.namespace() )

        jsonContent.setFileLocation({
            sourceFile: sourceFile,
            startLine: startLine,
            startColumn: startColumn,
            endLine: endLine,
            endColumn: endColumn,
        })

        const jsonObject = JSON.parse(fileContents)

        jsonContent.setJsonObject({ jsonObject: jsonObject })

        return jsonContent
    }


    createFileObject({
        sourceFile: sourceFile,
        startLine: startLine,
        startColumn: startColumn,
        endLine: endLine,
        endColumn: endColumn,
    }) {
        const file = this.namespace().FileObject.new()

        file.setFileLocation({
            sourceFile: sourceFile,
            startLine: startLine,
            startColumn: startColumn,
            endLine: endLine,
            endColumn: endColumn,
        })

        return file
    }
}

module.exports = Classification.define(JsonStructureParser)