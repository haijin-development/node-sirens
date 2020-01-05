const Classification = require('../../../O').Classification
const ObjectWithNamespace = require('../../../O').ObjectWithNamespace
const PositionInFile = require('./PositionInFile')
const StringStream = require('../../../O').StringStream
const SourceCodeText = require('..//SourceCodeText')
const FileObjectLocation = require('./FileObjectLocation')

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
        return this.fileLocation.getSourceFile().getOriginalSourceCode({
            fromLine: this.fileLocation.getStartPos().getLine(),
            fromColumn: this.fileLocation.getStartPos().getColumn(),
            toLine: this.fileLocation.getEndPos().getLine(),
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

    writeContents({ contents: contents }) {
        const firstStatementStartLine = this.fileLocation.getStartPos().getLine()
        const firstStatementStartColumn = this.fileLocation.getStartPos().getColumn()

        const lastStatementEndLine = this.fileLocation.getEndPos().getLine()
        const lastStatementEndColumn = this.fileLocation.getEndPos().getColumn()

        const sourceFile = this.fileLocation.getSourceFile()

        const fileContentsBefore = sourceFile.getOriginalSourceCode({
            fromLine: 1,
            fromColumn: 0,
            toLine: firstStatementStartLine,
            toColumn: firstStatementStartColumn,
        })

        const fileContentsAfter = sourceFile.getOriginalSourceCode({
            fromLine: lastStatementEndLine,
            fromColumn: lastStatementEndColumn,
        })

        const newFileContents = StringStream.new()

        newFileContents.append({ string: fileContentsBefore, if: fileContentsBefore !== '' })

        newFileContents.append({ string: contents, if: contents !== '' })

        newFileContents.append({ string: fileContentsAfter, if: fileContentsAfter !== '' })

        sourceFile.saveFileContents( newFileContents.getString() )
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
}

module.exports = Classification.define(FileObject)
