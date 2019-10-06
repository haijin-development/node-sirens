const Protocol = require('../../o-language/classifications/Protocol')

class JsStatementProtocol {
    /// Definition

    static definition() {
        this.instanceVariables = []
    }

    /// Accessing

    getSourceFile() {}

    /// Querying

    getStartingLine() {}

    getStartingColumn() {}

    getEndingLine() {}

    getEndingColumn() {}
}

module.exports = Protocol.define(JsStatementProtocol)
