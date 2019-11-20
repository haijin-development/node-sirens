const Classification = require('../../../O').Classification
const JsStatementProtocol = require('../../protocols/JsStatementProtocol')
const StringStream = require('../../../O').StringStream

/*
 * An expected yet missing statement within a js valid file.
 */
class EmptyJsStatement {
    /// Definition

    static definition() {
        this.instanceVariables = ['sourceFile', 'lineNumber', 'columnNumber']
        this.assumes = []
        this.implements = [JsStatementProtocol]
    }

    /// Initializing

    initialize({ sourceFile: sourceFile, lineNumber: lineNumber, columnNumber: columnNumber }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.sourceFile = sourceFile
        this.lineNumber = lineNumber
        this.columnNumber = columnNumber
    }

    /// Asking

    isPresent() {
        false
    }

    /// Accessing

    getSourceFile() {
        return this.sourceFile
    }

    getSourceCode() {
        return ''
    }

    getFormattedSourceCode() {
        return ''
    }

    /// Querying

    getStartingLine() {
        return this.lineNumber
    }

    getStartingColumn() {
        return this.columnNumber
    }

    getEndingLine() {
        return this.lineNumber
    }

    getEndingColumn() {
        return this.columnNumber
    }

    /// Writing

    writeFormattedSourceCode({ sourceCode: formattedSourceCode }) {
        const sourceCodeText = SourceCodeText.new({ text: this.getSourceCode() })

        const rawSourceCode = sourceCodeText.unformatBackText( formattedSourceCode )

        this.writeRawSourceCode({ rawSourceCode: rawSourceCode })
    }

    writeRawSourceCode({ rawSourceCode: rawSourceCode }) {
        const firstStatementStartLine = this.getStartingLine()
        const firstStatementStartColumn = this.getStartingColumn()

        const lastStatementEndLine = this.getEndingLine()
        const lastStatementEndColumn = this.getEndingColumn()

        const fileContentsBefore = this.getSourceFile().getOriginalSourceCode({
            fromLine: 1,
            fromColumn: 0,
            toLine: firstStatementStartLine,
            toColumn: firstStatementStartColumn,
        })

        const fileContentsAfter = this.getSourceFile().getOriginalSourceCode({
            fromLine: lastStatementEndLine,
            fromColumn: lastStatementEndColumn,
        })

        const newFileContents = StringStream.new()

        newFileContents.append({ string: fileContentsBefore, if: fileContentsBefore !== '' })

        newFileContents.append({ string: rawSourceCode, if: rawSourceCode !== '' })

        newFileContents.append({ string: fileContentsAfter, if: fileContentsAfter !== '' })

        this.getSourceFile().saveFileContents( newFileContents.getString() )
    }

}

module.exports = Classification.define(EmptyJsStatement)
