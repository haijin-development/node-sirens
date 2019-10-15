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

    definesMethod(methodName) {
        this.param(methodName) .isString()
    }

    getDefinedInstanceVariables() {}

    setDefinedInstanceVariables(instanceVariables) {
        this.param(instanceVariables) .isArray()

        instanceVariables.forEach( (instanceVariable) => {
            this.param(instanceVariable) .isString()
        })
    }

    definesInstanceVariable(name) {
        this.param(name) .isString()
    }

    getAssumptions() {}

    setAssumptions(assumptions) {}

    getRecursiveAssumptions() {}

    getAssumptionsChain() {}

    implements({ protocol: protocol }) {}
}

module.exports = Protocol.define(ClassificationProtocol)
