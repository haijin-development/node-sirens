const Classification = require('../Classification')
const OInstance = require('../OInstance')
const ParamValidator = require('./ParamValidator')

class ObjectValidator {
    /// Definition

    /*
        Tags([
            'definition', 'implementation'
        ])
    */
    static definition() {
        this.instanceVariables = ['methodInfo', 'object', 'validator']
        this.assumes = []
        this.implements = []
    }

    /// Initializing

    setMethodInfo(methodInfo) {
        this.methodInfo = methodInfo
    }

    getMethodInfo() {
        return this.methodInfo
    }

    setObject(object) {
        this.object = object
    }

    /// Dsl

    instanceVariable({ named: instanceVariableName, ownedBy: classification }) {
        const instanceVariableValue = this.getInstanceVariableValue({
            instanceVariableName: instanceVariableName,
            classification: classification,
        })

        this.validator = ParamValidator.new()

        this.validator.setMethodInfo( this.methodInfo )

        this.validator.setValue( instanceVariableValue )

        return this.validator
    }

    getInstanceVariableValue({ instanceVariableName: instanceVariableName, classification: classification }) {
        const object = this.object

        if( typeof( classification ) === 'string' ) {
            classification = object.getClassificationNamed({ name: classification })
        }

        const value = object.getClassificationInstanceVariableValue({
            classification: classification,
            instanceVariableName: instanceVariableName,
        })

        return value
    }

    evaluate() {
        this.validator.evaluate()
    }
}

module.exports = Classification.define(ObjectValidator)
