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
        this.instanceVariables = ['sourceFile', 'parseNodes']
    }

    /// Initializing

    initialize({ sourceFile: sourceFile, parseNodes: parseNodes }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.sourceFile = sourceFile
        this.parseNodes = parseNodes

        if( this.parseNodes.length === 0 ) {
            throw new Error(`JsStatement can not be empty. Use EmptyJsStatement instead.`)
        }
    }

    /// Expression parts bulding

    buildComment() {
        const Comment = require('./Comment')

        const expressionNode = this.getFirstNode()

        if( expressionNode.comment === undefined ) {
            return this.buildMissingComment()
        }

        return Comment.new({
            sourceFile: this.getSourceFile(),
            parseNode: expressionNode.comment,
        })
    }

    buildMissingComment() {
        const Comment = require('./Comment')

        const parseNode = {
            value: '',
            loc: {
                start: {
                    line: this.getStartingLine(),
                    column: this.getStartingColumn(),
                },
                end: {
                    line: this.getStartingLine(),
                    column: this.getStartingColumn(),
                },
            }
        }

        return Comment.new({
            sourceFile: this.getSourceFile(),
            parseNode: parseNode,
        })
    }

    /// Asking

    isPresent() {
        return true
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

    /// Position in file

    getFirstNode() {
        return this.parseNodes[0]
    }

    getLastNode() {
        return this.parseNodes[ this.parseNodes.length - 1 ]
    }

    getStartingPosition() {
        return this.getFirstNode().loc.start
    }

    getStartingLine() {
        return this.getStartingPosition().line
    }

    getStartingColumn() {
        return this.getStartingPosition().column
    }

    getEndingPosition() {
        return this.getLastNode().loc.end
    }

    getEndingLine() {
        return this.getEndingPosition().line
    }

    getEndingColumn() {
        return this.getEndingPosition().column
    }

    /// Formatting

    getFormattedSourceCode() {
        let originalSourceCode = this.getSourceCode()

        const sourceCodeText = SourceCodeText.new({ text: originalSourceCode })

        return sourceCodeText.getFormattedText()
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

    detectIdentation() {
        const sourceCodeText = SourceCodeText.new({
            text: this.getSourceCode(),
        })

        return {
            indentationChar: sourceCodeText.getIndentationChar(),
            indentationCount: sourceCodeText.getIndentationCount(),
        }
    }

}

module.exports = Classification.define(JsStatement)
