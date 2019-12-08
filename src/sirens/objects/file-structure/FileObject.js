const Classification = require('../../../O').Classification
const PositionInFile = require('./PositionInFile')
const StringStream = require('../../../O').StringStream
const SourceCodeText = require('..//SourceCodeText')

class FileObject {
    /// Definition

    static definition() {
        this.instanceVariables = ['sourceFile', 'startPos', 'endPos', 'childObjects']
    }

    afterInstantiation() {
        this.childObjects = []
    }

    setSourceFile(sourceFile) {
        this.sourceFile = sourceFile
    }

    getSourceFile() {
        return this.sourceFile
    }

    setStartPos({ line: line, column: column }) {
        this.startPos = PositionInFile.new({ line: line, column: column })
    }

    getStartPos() {
        return this.startPos
    }

    setEndPos({ line: line, column: column }) {
        this.endPos = PositionInFile.new({ line: line, column: column })
    }

    getEndPos() {
        return this.endPos
    }

    addChildObject(fileObject) {
        this.childObjects.push(fileObject)
    }

    getChildObjects() {
        return this.childObjects.slice()
    }

    getContents() {
        return this.sourceFile.getOriginalSourceCode({
            fromLine: this.startPos.getLine(),
            fromColumn: this.startPos.getColumn(),
            toLine: this.endPos.getLine(),
            toColumn: this.endPos.getColumn(),
        }) 
    }

    // Querying

    hasText() {
        return this.getContents().trim() !== ''
    }

    writeContents({ contents: contents }) {
        const firstStatementStartLine = this.getStartPos().getLine()
        const firstStatementStartColumn = this.getStartPos().getColumn()

        const lastStatementEndLine = this.getEndPos().getLine()
        const lastStatementEndColumn = this.getEndPos().getColumn()

        const sourceFile = this.getSourceFile()

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
