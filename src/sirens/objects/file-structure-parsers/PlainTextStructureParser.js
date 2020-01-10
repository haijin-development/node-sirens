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
        const fileContents = sourceFile.readFileContents()

        const textualContent = this.namespace().TextualContent.new()

        textualContent.setFileLocation({
            sourceFile: sourceFile,
            startPos: 0,
            endPos: 'eof',
        }) 

        return textualContent
    }
}

module.exports = Classification.define(PlainTextStructureParser)
