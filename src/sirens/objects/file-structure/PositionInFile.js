const Classification = require('../../../O').Classification

class PositionInFile {
    /// Definition

    static definition() {
        this.instanceVariables = ['line', 'column']
    }

    /// Initializing

    initialize({ line: line, column: column }) {
        this.line = line
        this.column = column
    }

    getLine() {
        return this.line
    }

    getColumn() {
        return this.column
    }

    buildString() {
        return `PositionInFile.new({ line: ${this.line}, column: ${this.column} })`
    }
}

module.exports = Classification.define(PositionInFile)
