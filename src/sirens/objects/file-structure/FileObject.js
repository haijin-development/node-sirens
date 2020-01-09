const Classification = require('../../../O').Classification
const ObjectWithNamespace = require('../../../O').ObjectWithNamespace
const PositionInFile = require('./PositionInFile')
const StringStream = require('../../../O').StringStream
const SourceCodeText = require('..//SourceCodeText')
const FileObjectLocation = require('./FileObjectLocation')
const Resource = require('../Resource')

class FileObject {
    /// Definition

    static definition() {
        this.instanceVariables = ['childObjects', 'fileLocation']
        this.assumes = [ObjectWithNamespace]
    }

    afterInstantiation() {
        this.childObjects = []
    }

    getSourceFile() {
        return this.fileLocation.getSourceFile()
    }

    getFileLocation() {
        return this.fileLocation
    }

    setFileLocation({
        sourceFile: sourceFile,
        startLine: startLine, startColumn: startColumn,
        endLine: endLine, endColumn: endColumn,
    }) {
        this.fileLocation = FileObjectLocation.new({
            sourceFile: sourceFile,
            startLine: startLine,
            startColumn: startColumn,
            endLine: endLine,
            endColumn: endColumn,
        })
    }

    addChildObject(fileObject) {
        this.childObjects.push(fileObject)
    }

    getChildObjects() {
        return this.childObjects.slice()
    }

    getChildObjectAt({ index: index }) {
        return this.childObjects[index]
    }

    getContents() {
        return this.getSourceFile().getPartialContents({
            fromLine: this.fileLocation.getStartPos().getLine() - 1,
            fromColumn: this.fileLocation.getStartPos().getColumn(),
            toLine: this.fileLocation.getEndPos().getLine() - 1,
            toColumn: this.fileLocation.getEndPos().getColumn(),
        }) 
    }

    // Querying

    getFileObjectType() {
        return 'fileObject'
    }

    getFileObjectDescription() {
        return 'file'
    }

    hasText() {
        return this.getContents().trim() !== ''
    }

    /*
        Method(`
            Writes the given contents to the FileObject location without modifying
            the contents in any way. 
        `)
    */
    writePlainContents({ contents: contents }) {
        const firstStatementStartLine = this.fileLocation.getStartPos().getLine()
        const firstStatementStartColumn = this.fileLocation.getStartPos().getColumn()

        const lastStatementEndLine = this.fileLocation.getEndPos().getLine()
        const lastStatementEndColumn = this.fileLocation.getEndPos().getColumn()

        const sourceFile = this.getSourceFile()

        const fileContentsBefore = sourceFile.getPartialContents({
            fromLine: 0,
            fromColumn: 0,
            toLine: firstStatementStartLine - 1,
            toColumn: firstStatementStartColumn,
        })

        const fileContentsAfter = sourceFile.getPartialContents({
            fromLine: lastStatementEndLine - 1,
            fromColumn: lastStatementEndColumn,
        })

        const newFileContents = StringStream.new()

        newFileContents.append({ string: fileContentsBefore, if: fileContentsBefore !== '' })

        newFileContents.append({ string: contents, if: contents !== '' })

        newFileContents.append({ string: fileContentsAfter, if: fileContentsAfter !== '' })

        sourceFile.writeFileContents( newFileContents.getString() )
    }

    getContentsIndentation() {
        const originalContents = this.getContents()

        const contentsText = SourceCodeText.new({ text: originalContents })

        const indentationLevel = contentsText.getIndentationLevel()
        const indentationChar = contentsText.getIndentationChar()

        return {
            level: indentationLevel,
            char: indentationChar,
        }
    }

    // Displaying

    getIcon() {
        return Resource.image.haiku
    }
}

module.exports = Classification.define(FileObject)
