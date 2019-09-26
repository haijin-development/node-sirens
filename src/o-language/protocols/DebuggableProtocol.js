const Protocol = require('../classifications/Protocol')

/*
 * Defines the public protocol of the Debuggable classification.
 */
class DebuggableProtocol {

    /// Debugging

    debugString({ cr: cr, tab: tab } = { cr: undefined, tab: undefined }) {}

}

module.exports = Protocol.define(DebuggableProtocol)
