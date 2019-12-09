const Classification = require('../../O').Classification
const JSFileStructureParser = require('./parsers/JSFileStructureParser')
const PlainTextStructureParser = require('./parsers/PlainTextStructureParser')

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
        if( this.fileTypesParsers.has( fileType ) ) {
            const getParserClosure = this.fileTypesParsers.get( fileType )

            return getParserClosure()
        }

        const getParserClosure = this.fileTypesParsers.get( 'default' )

        return getParserClosure()
    }
}

module.exports = Classification.define(SourceFileStructureParser)
