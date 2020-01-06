const splitLines = require('split-lines')
const Classification = require('../../../O').Classification
const ObjectWithNamespace = require('../../../O').ObjectWithNamespace
const TextualContent = require('../file-structure/TextualContent')

class PlainTextStructureParser {

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectWithNamespace]
    }

    /// Parsing

    parse({ sourceFile: sourceFile }) {
        const fileContents = sourceFile.getFileContents()

        const allLines = splitLines(fileContents)

        const lastLine = allLines[ allLines.length -1 ]

        const textualContent = this.namespace().TextualContent.new()

        textualContent.setFileLocation({
            sourceFile: sourceFile,
            startLine: 1,
            startColumn: 0,
            endLine: allLines.length,
            endColumn: lastLine.length,
        }) 

        return textualContent
    }
}

module.exports = Classification.define(PlainTextStructureParser)
