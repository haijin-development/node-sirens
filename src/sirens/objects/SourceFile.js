const Classification = require('../../O').Classification
const path = require('path')
const fs = require('fs')
const splitLines = require('split-lines')
const StringStream = require('../../O').StringStream

/*
 * A source file to query javascript definitions.
 */
class SourceFile {
    /// Definition

    static definition() {
        this.instanceVariables = ['filepath', 'fileStructure']
    }

    /// Initializing

    initialize({ filepath: filepath }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.filepath = path.resolve(filepath)

        this.doParseContents()
    }

    doParseContents() {
        const JSFileStructureParser = require('./parsers/JSFileStructureParser')

        this.fileStructure = JSFileStructureParser.new().parse({ sourceFile: this })
    }

    /// Accessing

    getFileStructure() {
        return this.fileStructure 
    }

    getFilePath() {
        return this.filepath
    }

    getFileName() {
        return path.basename(this.filepath)
    }

    getFileContents() {
        try {
            return fs.readFileSync(this.filepath).toString()
        } catch(e) {
            return null
        }
    }

    /// Asking

    isJavascriptFile() {
        return this.fileStructure && this.fileStructure.respondsTo( 'isJsFile' )
    }

    /// Querying

    existsFile() {
        return fs.existsSync( this.filepath )
    }

    getClassDefinitions() {
        return this.fileStructure.getClasses()
    }

    getFileSections() {
        return this.fileStructure.getChildSections()
    }

    getFunctionDefinitions() {
        return this.fileStructure.getMethods()
    }

    getOriginalSourceCode({
        fromLine: fromLine, fromColumn: fromColumn, toLine: toLine, toColumn: toColumn
    }) {
        const fileContents = this.getFileContents()

        const allLines = splitLines(fileContents)

        if( toLine === undefined && toColumn === undefined ) {
            toLine = allLines.length
            toColumn = allLines[toLine - 1].length
        }

        /// fromLine and toLine are 1 based whilst slice is 0 based.
        fromLine = fromLine - 1
        toLine = toLine - 1

        const firstLine = allLines[fromLine]

        const middleLines = allLines.slice(fromLine + 1, toLine)

        const lastLine = allLines[toLine]

        if(fromLine === toLine) {
            return firstLine.slice(fromColumn, toColumn)
        }

        let sourceCode = StringStream.new()

        sourceCode.append({ string: firstLine.slice(fromColumn) })

        if( middleLines.length > 0 ) {
            sourceCode.cr()
            sourceCode.append({ string: middleLines.join( "\n" ) })
        }

        sourceCode.cr()
        sourceCode.append({ string: lastLine.slice(0, toColumn) })

        return sourceCode.getString()
    }

    /// Actions

    reload() {
        this.doParseContents()
    }

    saveFileContents(newFileContents) {
        fs.writeFileSync( this.filepath, newFileContents )
    }
}

module.exports = Classification.define(SourceFile)
