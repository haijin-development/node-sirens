const Protocol = require('../../o-language/classifications/Protocol')

class JsStatementProtocol {
    /// Definition

    static definition() {
        this.instanceVariables = []
    }

    /// Accessing

    getSourceFile() {}

    getSourceCode() {}

    getFormattedSourceCode() {}

    /// Querying

    getStartingLine() {}

    getStartingColumn() {}

    getEndingLine() {}

    getEndingColumn() {}

    // Writing

    writeFormattedSourceCode({ sourceCode: formattedSourceCode }) {}

    writeRawSourceCode({ rawSourceCode: rawSourceCode }) {}
}

module.exports = Protocol.define(JsStatementProtocol)
