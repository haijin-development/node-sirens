const Classification = require('../../o-language/classifications/Classification')
const Sirens = require('../../Sirens')

/*
 * The definition of a javascript function.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class FunctionDefinition extends Classification {
    static from({ file: file, line: line, column: column }) {
        const SourceFile = require('./SourceFile')

        const sourceFile = SourceFile.new({ filepath: file })

        return sourceFile.getFunctionAt({ line: line, column: column })
    }

    /// Definition

    static definition() {
        this.instanceVariables = ['parseNode', 'sourceFile']
    }

    /// Initializing

    initialize({ parseNode: parseNode, sourceFile: sourceFile }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.parseNode = parseNode
        this.sourceFile = sourceFile
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

    getOriginalSourceCode({cr: cr}) {
        return this.sourceFile.getOriginalSourceCode({
            fromLine: this.getStartingLine(),
            fromColumn: this.getStartingColumn(),
            toLine: this.getEndingLine(),
            toColumn: this.getEndingColumn(),
            cr: cr
        })
    }
}

module.exports = FunctionDefinition