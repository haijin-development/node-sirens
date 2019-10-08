const Protocol = require('../classifications/Protocol')

class ValidationProtocol {
    getValidationResultOn({ value: value }) {}

    evaluateOn({ value: value }) {}
}

module.exports = Protocol.define(ValidationProtocol)
