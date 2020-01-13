const YAML = require('yaml')
const Classification = require('../../../../src/O').Classification
const ObjectWithNamespace = require('../../../../src/O').ObjectWithNamespace
const YamlContent = require('./YamlContent')

class YamlStructureParser {

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectWithNamespace]
    }

    /*
        Method(`
            Returns true if the sourceFile is a .yml file.

            This is quick check before starting the actual parsing of the file to know
            if it is a valid .yml file since starting the parsing of a file can be
            an expensive operation.
        `)
    */
    handlesFileTypeOf({ sourceFile: sourceFile }) {
        const yamlKnownExtensions = ['.yml', '.yaml']
        const fileExtension = sourceFile.getFileNameExtension()

        return yamlKnownExtensions.includes( fileExtension )
    }

    /// Parsing

    /*
        Method(`
            Returns the parsed contents of the given sourceFile.

            If the file is not a valid .yml file or if there are errors during the
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

        const yamlContent = this.createYamlContent({
            sourceFile: sourceFile,
            fileContents: fileContents,
        }) 

        file.addChildObject(yamlContent)

        return file
    }

    createYamlContent({
        sourceFile: sourceFile,
        fileContents: fileContents,
    }) {
        const yamlContent = YamlContent.new()

        yamlContent.setNamespace( this.namespace() )

        yamlContent.setFileLocation({
            sourceFile: sourceFile,
            startPos: 0,
            endPos: 'eof',
        })

        const yamlObject = YAML.parse(fileContents)

        yamlContent.setYamlObject({ yamlObject: yamlObject })

        return yamlContent
    }
}

module.exports = Classification.define(YamlStructureParser)
