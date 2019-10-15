const Protocol = require('../classifications/Protocol')

/*
 * Defines the public protocol of the Debuggable classification.
 */
class DebuggableProtocol {
    /// Debugging

    debugString({ cr: cr, tab: tab } = { cr: undefined, tab: undefined }) {
        this.param(cr) .isString() .or() .isUndefined()
        this.param(tab) .isString() .or() .isUndefined()
    }
}

module.exports = Protocol.define(DebuggableProtocol)
