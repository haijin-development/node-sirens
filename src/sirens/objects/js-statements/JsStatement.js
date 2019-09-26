const Classification = require('../../../o-language/classifications/Classification')
const StringStream = require('../../../o-language/classifications/StringStream')
const SourceCodeText = require('../SourceCodeText')

/*
 * The statements previous to a ClassDefinition.
 *
 * This section tipically includes the global requires, the global constants definintions, etc.
 */
class JsStatement {
    /// Definition

    static definition() {
        this.instanceVariables = ['sourceFile']
    }

    /// Initializing

    initialize({ sourceFile: sourceFile }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.sourceFile = sourceFile
    }

    /// Accessing

    getSourceFile() {
        return this.sourceFile
    }

    /*
     * Returns the source code of the class header.
     */
    getSourceCode() {
        return this.getSourceFile().getOriginalSourceCode({
            fromLine: this.getStartingLine(),
            fromColumn: this.getStartingColumn(),
            toLine: this.getEndingLine(),
            toColumn: this.getEndingColumn(),
        })
    }

    /// Formatting

    getFormattedSourceCode() {
        let originalSourceCode = this.getSourceCode()

        const sourceCodeText = SourceCodeText.new({ text: originalSourceCode })

        return sourceCodeText.getFormattedText()
    }

    /// Writing

    writeSourceCode(formattedSourceCode) {
        const sourceCodeText = SourceCodeText.new({ text: this.getSourceCode() })

        const sourceCode = sourceCodeText.unformatBackText( formattedSourceCode )

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

        newFileContents.append({ string: sourceCode, if: sourceCode !== '' })

        newFileContents.append({ string: fileContentsAfter, if: fileContentsAfter !== '' })

        this.getSourceFile().saveFileContents( newFileContents.getString() )
    }
}

module.exports = Classification.define(JsStatement)
