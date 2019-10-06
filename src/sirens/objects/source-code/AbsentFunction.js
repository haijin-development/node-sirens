const Classification = require('../../../o-language/classifications/Classification')
const JsStatementProtocol = require('../../protocols/JsStatementProtocol')

class AbsentFunction {
    /// Definition

    static definition() {
        this.instanceVariables = ['sourceFile', 'line', 'column']
        this.assumes = []
        this.implements = [JsStatementProtocol]
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

    /// Accessing

    getSourceFile() {
        return this.sourceFile
    }

    /// Queyring

    getName() {
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
