const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')
const JsStatementProtocol = require('../../protocols/JsStatementProtocol')

/*
    The statements after the last ClassDefinition in a ClassSourceFile.

    This section tipically includes the initialization code and the module exports.

    It is implemented as a wrapper on a parse tree node.
 */
class SourceFileFooter {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [JsStatement]
        this.implements = [JsStatementProtocol]
    }
}

module.exports = Classification.define(SourceFileFooter)
