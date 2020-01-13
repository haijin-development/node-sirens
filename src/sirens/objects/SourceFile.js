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
            Reads and returns the file contents between the given startPos to endPos.

            Both startPos and endPos are 0 based and included in the result.
        `)
    */
    getPartialContents({ fromStartPos: startPos, toEndPos: endPos }) {
        const fileContents = this.readFileContents()

        endPos = endPos === 'eof' ? this.getFileSize() : endPos

        return fileContents.slice( startPos, endPos + 1 )
    }
}

module.exports = Classification.define(SourceFile)
