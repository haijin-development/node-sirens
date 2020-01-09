const Classification = require('../../O').Classification
const FilePath = require('../../O').FilePath

/*
    Class(`
        A SourceFile object exnteds a FilePath with a method to filter a section of its
        contents.

        It is not clear yet if the wrapper makes sense or if the method
        getPartialContents should be moved to the classification FilePath. 
    `)
 */
class SourceFile {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [FilePath]
    }

    getPartialContents({
        fromLine: fromLine, fromColumn: fromColumn, toLine: toLine, toColumn: toColumn
    }) {
        const splitLines = require('split-lines')
        const StringStream = require('../../O').StringStream

        const fileContents = this.readFileContents()

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
}

module.exports = Classification.define(SourceFile)
