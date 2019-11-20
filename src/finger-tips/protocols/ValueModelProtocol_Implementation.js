const Protocol = require('../../O').Protocol
const ValueModelProtocol = require('./ValueModelProtocol')

class ValueModelProtocol_Implementation {
    /// Definition

    static definition() {
        this.assumes = [ValueModelProtocol]
    }

    /// Reading and writing values

    doGetValue() {}

    doSetValue(newValue) {}
}

module.exports = Protocol.define(ValueModelProtocol_Implementation)