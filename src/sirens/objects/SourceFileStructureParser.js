const Classification = require('../../O').Classification
const Pluggables = require('../Pluggables')

class SourceFileStructureParser {
    /// Definition

    static definition() {
        this.instanceVariables = ['fileTypesParsers']
    }

    // Initializing

    afterInstantiation() {
        this.fileTypesParsers = new Map()

        this.setParser({
            fileType: '.js',
            getParserClosure: function() { return JSFileStructureParser.new() },
        })

        this.setParser({
            fileType: 'default',
            getParserClosure: function() { return PlainTextStructureParser.new() },
        })
    }

    setParser({ fileType: fileType, getParserClosure: getParserClosure }) {
        this.fileTypesParsers.set(
            fileType,
            getParserClosure,
        )

        return this
    }

    // Parsing

    parseStructureIn({ sourceFile: sourceFile }) {
        const fileType = sourceFile.getFileType()

        return this.parseFile({
            sourceFile: sourceFile,
            fileType: fileType
        })
    }

    parseFile({ sourceFile: sourceFile, fileType: fileType }) {
        const parser = this.getParserForFileType({ fileType: fileType })

        return parser.parse({ sourceFile: sourceFile })        
    }

    // Parser selection

    getParserForFileType({ fileType: fileType }) {
        const fileTypeParsers = Pluggables.fileInspector.fileTypeParsers

        const parser = fileTypeParsers[fileType] ?
            fileTypeParsers[fileType]
            :
            fileTypeParsers.default

        return parser.new()
    }
}

module.exports = Classification.define(SourceFileStructureParser)
