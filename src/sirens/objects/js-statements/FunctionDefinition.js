const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')

/*
 * The definition of a javascript function.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class FunctionDefinition {

    /// Definition

    static definition() {
        this.instanceVariables = ['parseNode']
        this.assumes = [JsStatement]
        this.classificationBehaviours = [FunctionDefinitionBuilder]
    }

    /// Initializing

    initialize({ parseNode: parseNode, sourceFile: sourceFile }) {
        this.previousClassificationDo( () => {
            this.initialize({ sourceFile: sourceFile })
        })

        this.parseNode = parseNode
    }

    /// Queyring

    getFunctionName() {
        if( this.parseNode.type === 'MethodDefinition' ) {
            return this.parseNode.key.name
        } else {
            return this.parseNode.id.name
        }
    }

    getStartingPosition() {
        return this.parseNode.loc.start
    }

    getStartingLine() {
        return this.getStartingPosition().line
    }

    getStartingColumn() {
        return this.getStartingPosition().column
    }

    getEndingPosition() {
        return this.parseNode.loc.end
    }

    getEndingLine() {
        return this.getEndingPosition().line
    }

    getEndingColumn() {
        return this.getEndingPosition().column
    }

    /// Writing

    setSourceCode(functionSourceCode) {
        const functionStartLine = this.parseNode.loc.start.line
        const functionStartColumn = this.parseNode.loc.start.column
        const functionEndLine = this.parseNode.loc.end.line
        const functionEndColumn = this.parseNode.loc.end.column

        const fileContentsBeforeMethod = this.getSourceFile().getOriginalSourceCode({
            fromLine: 1,
            fromColumn: 0,
            toLine: functionStartLine,
            toColumn: functionStartColumn,
        })

        const fileContentsAfterMethod = this.getSourceFile().getOriginalSourceCode({
            fromLine: functionEndLine,
            fromColumn: functionEndColumn,
        })

        const newFileContents = fileContentsBeforeMethod +

            functionSourceCode +

            fileContentsAfterMethod

        this.getSourceFile().saveFileContents( newFileContents )
    }
}

class FunctionDefinitionBuilder {
    from({ file: file, line: line, column: column }) {
        const SourceFile = require('../SourceFile')

        const sourceFile = SourceFile.new({ filepath: file })

        return sourceFile.getFunctionAt({ line: line, column: column })
    }
}

FunctionDefinitionBuilder = Classification.define(FunctionDefinitionBuilder)

module.exports = Classification.define(FunctionDefinition)