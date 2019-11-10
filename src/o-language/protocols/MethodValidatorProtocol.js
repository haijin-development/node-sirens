const Protocol = require('../classifications/Protocol')

class MethodValidatorProtocol {
    /*
 Tags([
    'public', 'dsl'
 ])
*/
param(parameter) {}

    /*
 Tags([
    'public', 'evaluating'
 ])
*/
evaluateCollectedValidation() {}
}

module.exports = Protocol.define(MethodValidatorProtocol)
