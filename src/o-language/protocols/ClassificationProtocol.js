const Protocol = require('../classifications/Protocol')

/*
 * Defines the public protocol of the Classification classification.
 */
class ClassificationProtocol {
    /// Creating classifications

    define(classificationDefinition) {}

    createObject() {}

    new(...props) {}

    /// Querying

    getName() {}

    getClassificationDefinition() {}

    setClassificationDefinition(classificationDefinition) {}

    getDefinedMethodNames() {}

    definesMethod(methodName) {}

    getDefinedInstanceVariables() {}

    setDefinedInstanceVariables(instanceVariables) {}

    definesInstanceVariable(name) {}

    getAssumptions() {}

    setAssumptions(assumptions) {}

    getRecursiveAssumptions() {}

    getAssumptionsChain() {}

    implements({ protocol: protocol }) {}
}

module.exports = Protocol.define(ClassificationProtocol)
