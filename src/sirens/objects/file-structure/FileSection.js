const Classification = require('../../../O').Classification
const PositionInFile = require('./PositionInFile')
const StringStream = require('../../../O').StringStream
const SourceCodeText = require('..//SourceCodeText')

class FileSection {
    /// Definition

    static definition() {
        this.instanceVariables = ['sourceFile', 'startPos', 'endPos', 'childSections']
    }

    afterInstantiation() {
        this.childSections = []
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

    addChildSection(fileSection) {
        this.childSections.push(fileSection)
    }

    getChildSections() {
        return this.childSections.slice()
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

    textualContentBetween(anotherFileSection) {
        const TextualContent = require('./TextualContent')

        const textualContent = TextualContent.new()

        textualContent.setSourceFile( this.getSourceFile() )

        if( this.beginsBefore( anotherFileSection ) ) {
            textualContent.setStartPos({
                line: this.getEndPos().getLine(),
                column: this.getEndPos().getColumn(),
            })

            textualContent.setEndPos({
                line: anotherFileSection.getStartPos().getLine(),
                column: anotherFileSection.getStartPos().getColumn(),
            })
        } else {
            textualContent.setStartPos({
                line: anotherFileSection.getEndPos().getLine() ,
                column: anotherFileSection.getEndPos().getColumn(),
            })

            textualContent.setEndPos({
                line: this.getStartPos().getLine(),
                column: this.getStartPos().getColumn(),
            })
        }

        return textualContent
    }

    beginsBefore(anotherFileSection) {
        const startPos = this.getStartPos()
        const anotherStartPos = anotherFileSection.getStartPos()

        return
            startPos.getLine() < anotherStartPos.getLine()
            ||
            (
                startPos.getLine() === anotherStartPos.getLine()
                &&
                startPos.getColumn() < anotherStartPos.getColumn()
            )

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

module.exports = Classification.define(FileSection)
