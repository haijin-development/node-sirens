const Classification = require('../../../o-language/classifications/Classification')
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
}

module.exports = Classification.define(ClassHeader)