const Classification = require('../../../o-language/classifications/Classification')
const JsStatementProtocol = require('../../protocols/JsStatementProtocol')

/*
 * An expected yet missing statement within a js valid file.
 */
class EmptyJsStatement {
    /// Definition

    static definition() {
        this.instanceVariables = ['sourceFile', 'lineNumber', 'columnNumber']
        this.assumes = []
        this.implements = [JsStatementProtocol]
    }

    /// Initializing

    initialize({ sourceFile: sourceFile, lineNumber: lineNumber, columnNumber: columnNumber }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.sourceFile = sourceFile
        this.lineNumber = lineNumber
        this.columnNumber = columnNumber
    }

    /// Asking

    isPresent() {
        false
    }

    /// Accessing

    getSourceFile() {
        return this.sourceFile
    }

    getSourceCode() {
        return ''
    }

    getString() {
        return ''
    }

    /// Querying

    getStartingLine() {
        return this.lineNumber
    }

    getStartingColumn() {
        return this.columnNumber
    }

    getEndingLine() {
        return this.lineNumber
    }

    getEndingColumn() {
        return this.columnNumber
    }
}

module.exports = Classification.define(EmptyJsStatement)
