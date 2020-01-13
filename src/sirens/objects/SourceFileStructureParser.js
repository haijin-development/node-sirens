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
        // review
        try {

            const fileInspectors = this.namespace().FileInspectorPlugins.new()

            for( const eachParser of fileInspectors.getAvailableFileParsers() ) {
                const parsedContents = eachParser.parse({ sourceFile: sourceFile })

                if( parsedContents ) {
                    return parsedContents
                }
            }

            const defaultParser = this.getDefaultParser()

            return defaultParser.parse({ sourceFile: sourceFile })

        } catch( error ) {
            if( errorHandler !== undefined ) {
                return errorHandler()
            }
        }
    }

    /*
        Method(`
            Returns a default file parser in case none of the existing plugins handle
            the given sourceFile.

            The default parser treats the file as a plain text file, meaning that it
            its structure has only one JsObject, the textual contents of the whole file.
        `)
    */
    getDefaultParser() {
        return this.namespace().PlainTextStructureParser.new()
    }
}

module.exports = Classification.define(SourceFileStructureParser)
