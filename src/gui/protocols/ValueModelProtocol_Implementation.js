const Protocol = require('../../o-language/classifications/Protocol')

class ValueModelProtocol_Implementation {
    /// Reading and writing values

    doGetValue() {}

    doSetValue(newValue) {}
}

module.exports = Protocol.define(ValueModelProtocol_Implementation)