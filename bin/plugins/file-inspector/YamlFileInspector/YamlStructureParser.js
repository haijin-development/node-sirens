const splitLines = require('split-lines')
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
        const fileContents = sourceFile.getFileContents()

        const allLines = splitLines(fileContents)

        const lastLine = allLines[ allLines.length -1 ]

        const startLine = 1
        const startColumn = 0
        const endLine = allLines.length
        const endColumn = lastLine.length

        const file = this.createFileObject({
            sourceFile: sourceFile,
            startLine: 1,
            startColumn: 0,
            endLine: allLines.length,
            endColumn: lastLine.length,
        }) 

        const yamlContent = this.createYamlContent({
            sourceFile: sourceFile,
            startLine: 1,
            startColumn: 0,
            endLine: allLines.length,
            endColumn: lastLine.length,
            fileContents: fileContents,
        }) 

        file.addChildObject(yamlContent)

        return file
    }

    createYamlContent({
        sourceFile: sourceFile,
        startLine: startLine,
        startColumn: startColumn,
        endLine: endLine,
        endColumn: endColumn,
        fileContents: fileContents,
    }) {
        const yamlContent = YamlContent.new()

        yamlContent.setNamespace( this.namespace() )

        yamlContent.setFileLocation({
            sourceFile: sourceFile,
            startLine: startLine,
            startColumn: startColumn,
            endLine: endLine,
            endColumn: endColumn,
        })

        const yamlObject = YAML.parse(fileContents)

        yamlContent.setYamlObject({ yamlObject: yamlObject })

        return yamlContent
    }


    createFileObject({
        sourceFile: sourceFile,
        startLine: startLine,
        startColumn: startColumn,
        endLine: endLine,
        endColumn: endColumn,
    }) {
        const file = this.namespace().FileObject.new()

        file.setFileLocation({
            sourceFile: sourceFile,
            startLine: startLine,
            startColumn: startColumn,
            endLine: endLine,
            endColumn: endColumn,
        })

        return file
    }
}

module.exports = Classification.define(YamlStructureParser)
