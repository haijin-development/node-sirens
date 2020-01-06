const Classification = require('../../O').Classification
const ObjectWithNamespace = require('../../O').ObjectWithNamespace

/*
    Class(`
        This object parses a File (usually a textual source code file) to create
        and return a structured model of the file contents.

        For example for a .json file it might return a structure representing the
        json contents and for a js it might return a structured model of the js methods
        and function.

        This object does not implement the parsing and convertion into a strutured model
        but it plays the role of a Facade pattern.

        The actual parsing is done by specific file contents parsers that can be
        dynamically plugged into this SourceFileStructureParser object.
    `)
*/
class SourceFileStructureParser {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectWithNamespace]
    }

    // Parsing

    parseSourceFile({ sourceFile: sourceFile, onParsingErrorDo: errorHandler }) {
        try {

            return this.parseFile({ sourceFile: sourceFile })

        } catch(error) {
            if( errorHandler !== undefined ) {
                return errorHandler(error)
            }

            throw error
        }
    }

    parseFile({ sourceFile: sourceFile }) {
        const parser = this.getParserForFileType({ sourceFile: sourceFile })

        return parser.parse({ sourceFile: sourceFile })  
    }

    // Parser selection

    getParserForFileType({ sourceFile: sourceFile }) {
        const fileParser = this.namespace().FileInspectorPlugins.new()
            .pickFileParserFor({ sourceFile: sourceFile })

        return fileParser
    }
}

module.exports = Classification.define(SourceFileStructureParser)
