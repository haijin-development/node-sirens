const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')

class AbsentFunction {
    /// Definition

    static definition() {
        this.instanceVariables = ['line', 'column']
        this.assumes = [JsStatement]
    }

    /// Initializing

    initialize({ sourceFile: sourceFile, line: line, column: column }) {
        this.previousClassificationDo( () => {
            this.initialize({
                sourceFile: sourceFile,
            })
        })

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

    getSourceCode() {
        return 'Source code not found'
    }
}

module.exports = Classification.define(AbsentFunction)
