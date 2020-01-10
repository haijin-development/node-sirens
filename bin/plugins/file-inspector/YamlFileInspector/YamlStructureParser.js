const YAML = require('yaml')
const Classification = require('../../../../src/O').Classification
const ObjectWithNamespace = require('../../../../src/O').ObjectWithNamespace
const YamlContent = require('./YamlContent')

class YamlStructureParser {

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectWithNamespace]
    }

    /// Parsing

    parse({ sourceFile: sourceFile }) {
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
