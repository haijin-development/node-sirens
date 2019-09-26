const ClassificationInstantiation = require('./classification-instantiation')
const O_Object = require('./o-object')

class ActiveClassification {
    /*
     * Pushes the given classification in the call stack of the given object.
     */
    static pushInto({ object: object, instantiatedClassification: instantiatedClassification }) {
        O_Object.pushActiveInstantiatedClassification({
            object: object,
            instantiatedClassification: instantiatedClassification,
        })
    }

    /*
     * Pops the classification from the call stack of the given object.
     */
    static popFrom({ object: object }) {
        O_Object.popActiveInstantiatedClassification({
            object: object,
        })
    }

    /*
     * Returns the active classification from the call stack of the given object.
     */
    static in({ object: object, offset: offset }) {
        return O_Object.getMostRecentActiveInstantiatedClassification({
            object: object,
            offset: offset,
        })
    }

    /*
     * Returns the active classification from the call stack of the given object.
     */
    static getActiveClassificationObjectIn({ object: object, offset: offset }) {
        const activeInstantiatedClassification = ActiveClassification.in({
            object : object,
            offset: offset,
        })

        if( activeInstantiatedClassification === undefined ) {
            return undefined
        }

        return ClassificationInstantiation.getSourceClassification({
            classificationInstantiation: activeInstantiatedClassification
        })
    }

    /*
     * Returns true if the given propName is an instance variable of the active classification, false otherwise.
     */
    static hasInstanceVariable({ object: object, instanceVariableName: instanceVariableName }) {
        const activeInstantiatedClassification = ActiveClassification.in({ object : object })

        if( activeInstantiatedClassification === undefined ) {
            return false
        }

        return ClassificationInstantiation.hasInstanceVariable({
            classificationInstantiation: activeInstantiatedClassification,
            instanceVariableName: instanceVariableName,
        })
    }

    /*
     * Returns the value of the instance variable in the active classification.
     * Assumes that the instance variable exists in that classification.
     * That assumption might be tested first with isInstanceVariableInActiveClassification(object, instVarName).
     */
    static getInstanceVariableValue({ object: object, instanceVariableName: instanceVariableName }) {
        const activeInstantiatedClassification = ActiveClassification.in({
            object: object
        })

        if( activeInstantiatedClassification === undefined ) {
            return undefined
        }

        return ClassificationInstantiation.getInstanceVariableValue({
            classificationInstantiation: activeInstantiatedClassification,
            instanceVariableName: instanceVariableName,
        })
    }

    /*
     * Set the prop value in the current classification instantiation.
     * The instance variables do not belong to an object but to an instantiation of a classification in that
     * object.
     */
    static setInstanceVariableValue({
        object: object, instanceVariableName: instanceVariableName, value: value}
    ) {
        const activeInstantiatedClassification = ActiveClassification.in({
            object: object
        })

        // If there is not active classification then set the value to an object property
        if( activeInstantiatedClassification === undefined ) {
            object[instanceVariableName] = value

            return
        }

        ClassificationInstantiation.setInstanceVariableValue({
            classificationInstantiation: activeInstantiatedClassification,
            instanceVariableName: instanceVariableName,
            value: value,
        })
    }
}


module.exports = ActiveClassification

