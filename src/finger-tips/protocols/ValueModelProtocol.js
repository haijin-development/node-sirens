const Protocol = require('../../O').Protocol

class ValueModelProtocol {
    /// Reading and writing values

    getValue() {}

    setValue(newValue) {}

    /// Listening

    onValueChanged(closure) {
        this.param(closure) .isFunction()
    }

    /// Comparing

    isSameValue(newValue) {}

    /// Triggering

    triggerValueChanged({ oldValue: oldValue, newValue: newValue }) {}
}

module.exports = Protocol.define(ValueModelProtocol)