const Protocol = require('../../o-language/classifications/Protocol')

class JsStatementProtocol {
    /// Accessing

    getSourceFile() {}

    /// Querying

    getStartingLine() {}

    getStartingColumn() {}

    getEndingLine() {}

    getEndingColumn() {}
}

module.exports = Protocol.define(JsStatementProtocol)
