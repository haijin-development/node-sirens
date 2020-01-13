const Classification = require('../../../../src/O').Classification
const ObjectWithNamespace = require('../../../../src/O').ObjectWithNamespace
const JsonContent = require('./JsonContent')

class JsonStructureParser {

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectWithNamespace]
    }

    /*
        Method(`
            Returns true if the sourceFile is a .json file.

            This is quick check before starting the actual parsing of the file to know
            if it is a valid .json file since starting the parsing of a file can be
            an expensive operation.
        `)
    */
    handlesFileTypeOf({ sourceFile: sourceFile }) {
        const fileExtension = sourceFile.getFileNameExtension()

        return '.json' === fileExtension
    }

    /// Parsing

    /*
        Method(`
            Returns the parsed contents of the given sourceFile.

            If the file is not a valid .json file or if there are errors during the
            file parsing returns null, meaning that the given sourceFile is not
            parsable by this parser.
        `)
    */
    parse({ sourceFile: sourceFile }) {
        if( ! this.handlesFileTypeOf({ sourceFile: sourceFile }) ) { return null }

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
