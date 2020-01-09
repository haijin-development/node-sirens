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

    /*
        Method(`
            Reads and returns the file contents between the given fromLine, fromColumn,
            toLine and toColumn.

            All lines and colums are 0 based.
        `)
    */
    getPartialContents({
        fromLine: fromLine, fromColumn: fromColumn, toLine: toLine, toColumn: toColumn
    }) {
        const fileContents = this.readFileContents()
        const fileContentsSize = this.readFileContents().length

        let i = 0
        let linesCount = 0

        // make a first pass to collect the partial section indices

        while( i < fileContentsSize ) {
            if( linesCount === fromLine ) { break }

            if( fileContents[ i ] === `\n` ) {
                linesCount += 1
            }

            i += 1
        }

        const partialContentsStart = i + fromColumn

        // toLine can be at most fileContentsSize
        if( toLine === undefined ) { toLine = fileContentsSize }

        while( i < fileContentsSize ) {
            if( linesCount === toLine ) { break }

            if( fileContents[ i ] === `\n` ) {
                linesCount += 1
            }

            i += 1
        }

        // toColumn can be at most fileContentsSize
        if( toColumn === undefined ) { toColumn = fileContentsSize }

        const partialContentsEnd = Math.min( i + toColumn, fileContentsSize )

        // and in a second pass slice the contents. This avoids concatenating
        // intermediate partial strings which for small files may be more
        // inefficient than reading the file stream twice

        return fileContents.slice( partialContentsStart, partialContentsEnd )
    }
}

module.exports = Classification.define(SourceFile)
