/*
 * The definition of a javascript function.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class FunctionDefinition {
    static from({ file: file, line: line, column: column }) {
        const SourceFile = require('./SourceFile')

        const sourceFile = new SourceFile({ filepath: file })

        return sourceFile.getFunctionAt({ line: line, column: column })
    }

    /// Initializing

    constructor(parseNode) {
        this.parseNode = parseNode
    }

    /// Accessing

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

    /// Displaying

    toSourceCode() {
        return this.toString()
    }
}

module.exports = FunctionDefinition