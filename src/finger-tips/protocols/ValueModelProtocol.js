const Protocol = require('../../O').Protocol

class ValueModelProtocol {
    /// Reading and writing values

    getValue() {}

    setValue(newValue) {}

    /// Listening

    onValueChanged({ with: object, do: closure }) {
        this.param(object) .isObject()
        this.param(closure) .isFunction()
    }

    /// Comparing

    isSameValue(newValue) {}

    /// Triggering

    announceValueChanged({ oldValue: oldValue, newValue: newValue }) {}
}

module.exports = Protocol.define(ValueModelProtocol)