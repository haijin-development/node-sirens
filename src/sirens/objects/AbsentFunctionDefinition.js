const Classification = require('../../o-language/classifications/Classification')

/*
 * The definition of a javascript function.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class AbsentFunctionDefinition extends Classification {
    /// Definition

    static definition() {
        this.instanceVariables = ['sourceFile', 'line', 'column']
    }

    /// Initializing

    initialize({ sourceFile: sourceFile, line: line, column: column }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.sourceFile = sourceFile
        this.line = line
        this.column = column
    }

    /// Queyring

    getFunctionName() {
        return 'Function not found'
    }

    getStartingPosition() {
        return {
            line: undefined,
            column: undefined,
        }
    }

    getStartingLine() {
        return this.getStartingPosition().line
    }

    getStartingColumn() {
        return this.getStartingPosition().column
    }

    getEndingPosition() {
        return {
            line: undefined,
            column: undefined,
        }
    }

    getEndingLine() {
        return this.getEndingPosition().line
    }

    getEndingColumn() {
        return this.getEndingPosition().column
    }

    getOriginalSourceCode({cr: cr}) {
        return 'Source code not found'
    }
}

module.exports = AbsentFunctionDefinition