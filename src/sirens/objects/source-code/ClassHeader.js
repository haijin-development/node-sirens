const Classification = require('../../../O').Classification
const JsStatement = require('./JsStatement')
const JsStatementProtocol = require('../../protocols/JsStatementProtocol')

/*
 * The statements previous to a ClassDefinition.
 *
 * This section tipically includes the global requires, the global constants definintions, etc.
 */
class ClassHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [JsStatement]
        this.implements = [JsStatementProtocol]
    }

    /// Asking

    isHeader() {
        return true
    }
}

module.exports = Classification.define(ClassHeader)
