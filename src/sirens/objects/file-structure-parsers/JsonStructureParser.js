const splitLines = require('split-lines')
const Classification = require('../../../O').Classification
const FileObject = require('../file-structure/FileObject')
const JsonContent = require('../file-structure/JsonContent')

class JsonStructureParser {

    static definition() {
        this.instanceVariables = []
    }

    /// Parsing

    parse({ sourceFile: sourceFile }) {
        const fileContents = sourceFile.getFileContents()

        const allLines = splitLines(fileContents)

        const lastLine = allLines[ allLines.length -1 ]

        const jsonContent = JsonContent.new()

        jsonContent.setSourceFile( sourceFile )

        jsonContent.setStartPos({
            line: 1,
            column: 0,
        })

        jsonContent.setEndPos({
            line: allLines.length,
            column: lastLine.length,
        })

        const jsonObject = JSON.parse(fileContents)

        jsonContent.setJsonObject({ jsonObject: jsonObject })


        const file = FileObject.new()

        file.setSourceFile( sourceFile )

        file.setStartPos({
            line: 1,
            column: 0,
        })

        file.setEndPos({
            line: allLines.length,
            file: lastLine.length,
        })

        file.addChildObject(jsonContent)

        return file
    }
}

module.exports = Classification.define(JsonStructureParser)
