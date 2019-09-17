const ClassificationInstantiation = require('./classification-instantiation')

class ActiveClassification {
    /*
     * Pushes the given classification in the call stack of the given object.
     */
    static pushInto({ object: object, classification: classification }) {
        object.impl.activeClassificationStack.push(classification)
    }

    /*
     * Pops the classification from the call stack of the given object.
     */
    static popFrom({ object: object }) {
        object.impl.activeClassificationStack.pop()
    }

    /*
     * Returns the active classification from the call stack of the given object.
     */
    static in({ object }) {
        const length = object.impl.activeClassificationStack.length

        return object.impl.activeClassificationStack[ length - 1 ]
    }

    /*
     * Returns true if the given propName is an instance variable of the active classification, false otherwise.
     */
    static hasInstanceVariable({ object: object, instanceVariableName: instanceVariableName }) {
        const activeClassification = ActiveClassification.in({ object : object })

        if(activeClassification === undefined) {
            return false
        }

        return ClassificationInstantiation.hasInstanceVariable({
            classificationInstantiation: activeClassification,
            instanceVariableName: instanceVariableName,
        })
    }

    /*
     * Returns the value of the instance variable in the active classification.
     * Assumes that the instantace variable exists in that classification.
     * That assumption might be tested first with isInstanceVariableInActiveClassification(object, instVarName).
     */
    static getInstanceVariableValue({ object: object, instanceVariableName: instanceVariableName }) {
        const activeClassification = ActiveClassification.in({
            object: object
        })

        if( activeClassification === undefined ) {
            return undefined
        }

        return ClassificationInstantiation.getInstanceVariableValue({
            classificationInstantiation: activeClassification,
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
        const activeClassification = ActiveClassification.in({
            object: object
        })

        if( activeClassification === undefined ) {
            object[instanceVariableName] = value

            return
        }

        if( ! activeClassification.constructor.instanceVariables.includes(instanceVariableName) ) {
            const classificationsName = 
                activeClassification.sourceClassification.getClassificationDefinition().name

            throw new Error(`'${instanceVariableName}' is not an instance variable of ${classificationsName} Classification.`)
        }

        activeClassification[instanceVariableName] = value
    }
}


module.exports = ActiveClassification

