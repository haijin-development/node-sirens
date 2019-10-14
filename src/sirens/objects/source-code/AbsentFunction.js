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

    getSourceCode() {
        return 'Function not found'
    }

    getFormattedSourceCode() {
        return 'Function not found'
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

    /// Writing

    writeFormattedSourceCode({ sourceCode: formattedSourceCode }) {
        throw new Error(`Not implemented`)
    }

    writeRawSourceCode({ rawSourceCode: rawSourceCode }) {
        throw new Error(`Not implemented`)
    }
}

module.exports = Classification.define(AbsentFunction)
