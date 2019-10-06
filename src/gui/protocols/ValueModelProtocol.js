const Protocol = require('../../o-language/classifications/Protocol')

class ValueModelProtocol {
    /// Reading and writing values

    getValue() {}

    setValue(newValue) {}

    /// Listening

    onValueChanged(closure) {}

    /// Comparing

    isSameValue(newValue) {}
}

module.exports = Protocol.define(ValueModelProtocol)