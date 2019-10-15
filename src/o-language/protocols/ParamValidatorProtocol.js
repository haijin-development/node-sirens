const Protocol = require('../classifications/Protocol')

class ParamValidatorProtocol {

    /// Accessing

    setValue(value) {}

    /// Evaluating

    evaluate() {}

    /// Validations

    isNull() {}

    notNull() {}

    isUndefined() {}

    notUndefined() {}

    isBoolean() {}

    isString() {}

    isNumber() {}

    isInteger() {}

    isArray() {}

    isObject() {}

    isFunction() {}

    isAnyOf(values) {}

    compliesWith(procotol) {}

    isExpectedTo(closure) {}
}

module.exports = Protocol.define(ParamValidatorProtocol)
