const Protocol = require('../../o-language/classifications/Protocol')
const JsStatementProtocol = require('./JsStatementProtocol')

class JsCommentProtocol {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [JsStatementProtocol]
    }

    /// Accessing

    getSourceFile() {}

    getContents() {}

    getFormattedContents() {}

    /// Querying

    getStartingLine() {}

    getStartingColumn() {}

    getEndingLine() {}

    getEndingColumn() {}

    getContents() {}

    getFormattedContents() {}

    // Writing

    writeFormattedContents({ commentContents: commentContents }) {}

}

module.exports = Protocol.define(JsCommentProtocol)
