const splitLines = require('split-lines')
const Classification = require('../../../O').Classification
const TextualContent = require('../file-structure/TextualContent')

class PlainTextStructureParser {

    static definition() {
        this.instanceVariables = []
    }

    /// Parsing

    parse({ sourceFile: sourceFile }) {
        const fileContents = sourceFile.getFileContents()

        const allLines = splitLines(fileContents)

        const lastLine = allLines[ allLines.length -1 ]

        const textualContent = TextualContent.new()

        textualContent.setSourceFile( sourceFile )

        textualContent.setStartPos({
            line: 1,
            column: 0,
        })

        textualContent.setEndPos({
            line: allLines.length,
            column: lastLine.length,
        })

        return textualContent
    }
}

module.exports = Classification.define(PlainTextStructureParser)
