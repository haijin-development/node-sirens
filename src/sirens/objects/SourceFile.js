const Classification = require('../../O').Classification
const FilePath = require('../../O').FilePath
const splitLines = require('split-lines')
const StringStream = require('../../O').StringStream

/*
 * A source file to query javascript definitions.
 */
class SourceFile {
    /// Definition

    static definition() {
        this.instanceVariables = ['filepath']
    }

    /// Initializing

    initialize({ filepath: filepath }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.filepath = FilePath.new({ path: filepath })
    }

    /// Accessing

    getFilePath() {
        return this.filepath
    }

    getFileName() {
        return this.filepath.getFileName()
    }

    getFileContents() {
        return this.filepath.readFileContents()
    }

    getFileType() {
        return this.filepath.getFileNameExtension()
    }

    /// Querying

    isFolder() {
        return this.filepath.isFolderPath()
    }

    existsFile() {
        return this.filepath.isFilePath() && this.filepath.exists()
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

    saveFileContents(newFileContents) {
        this.filepath.writeFileContents( newFileContents )
    }
}

module.exports = Classification.define(SourceFile)
