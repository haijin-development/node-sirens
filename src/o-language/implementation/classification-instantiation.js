const ClassificationDefinition = require('./classification-definition')
const O_Object = require('./o-object')
const {InstanceVariableNotFoundError} = require('../classifications/Errors')

class ClassificationInstantiation {
    /*
     * Returns the index of the given classification in the array of the instantiated classifications of the
     * given object.
     */
    static findClassificationIndex({ object: object, classificationObject: classificationObject }) {
        const classificationInstantiations = ClassificationInstantiation.getInstantiatedClassifications({
            object: object
        })

        return classificationInstantiations.findIndex( (classificationInstantiation) => {
                return classificationInstantiation.sourceClassification === classificationObject
            })
    }

    /*
     * Returns an array with all of the classifications instantiated in the given object.
     */
    static getInstantiatedClassifications({ object: object }) {
        return O_Object.getAllInstantiatedClassifications({ object: object })
    }

    /*
     * Returns the classification definition of a classificationInstantiation.
     * The classification definition is the class where the instance methods are defined.
     */
    static getClassificationDefinition({ classificationInstantiation: classificationInstantiation }) {
        return classificationInstantiation.definition
    }

    static getSourceClassification({ classificationInstantiation: classificationInstantiation }) {
        return classificationInstantiation.sourceClassification
    }

    static getMethod({ classificationInstantiation: classificationInstantiation, methodName: methodName }) {
        const classificationDefinition = ClassificationDefinition.getClassificationDefinition({
            classificationInstantiation: classificationInstantiation
        })

        return ClassificationDefinition.getMethod({
            classificationDefinition: classificationDefinition,
            methodName: methodName
        })
    }

    /*
     * Returns the classification definition of a classificationInstantiation.
     * The classification definition is the class where the instance methods are defined.
     */
    static getInstanceVariables({ classificationInstantiation: classificationInstantiation }) {
        const classificationDefinition = ClassificationInstantiation.getClassificationDefinition({
                classificationInstantiation: classificationInstantiation
            })

        return ClassificationDefinition.getDefinedInstanceVariables({
            classificationDefinition: classificationDefinition
        })
    }

    /*
     * Returns true if the given propName is an instance variable of the given classification instantiation, false otherwise.
     */
    static hasInstanceVariable({
        classificationInstantiation:classificationInstantiation, instanceVariableName: instanceVariableName
    }) {
        const instanceVariables = ClassificationInstantiation.getInstanceVariables({
            classificationInstantiation: classificationInstantiation
        })

        return instanceVariables.includes(instanceVariableName)
    }

    /*
     * Returns the value of the instance variable int the given classificationInstantiation.
     * Assumes that the instantace variable exists in that classificationInstantiation.
     * That assumption might be tested first with isInstanceVariableOfClassificationInstantiation.
     */
    static getInstanceVariableValue({
        classificationInstantiation: classificationInstantiation, instanceVariableName: instanceVariableName
    }) {
        const classificationDefinition = ClassificationInstantiation.getClassificationDefinition({
            classificationInstantiation: classificationInstantiation
        })

        const instanceVariableIsDefined = ClassificationDefinition.hasInstanceVariableDefined({
            classificationDefinition: classificationDefinition,
            instanceVariableName: instanceVariableName,
        })

        if( ! instanceVariableIsDefined ) {
            const classificationsName = ClassificationDefinition.getName({
                classificationDefinition: classificationDefinition
            })

            throw new InstanceVariableNotFoundError(`'${instanceVariableName}' is not an instance variable of ${classificationsName} Classification.`)
        }

        return classificationInstantiation[instanceVariableName]
    }

    static setInstanceVariableValue({
        classificationInstantiation: classificationInstantiation,
        instanceVariableName: instanceVariableName,
        value: value
    }) {
        const classificationDefinition = ClassificationInstantiation.getClassificationDefinition({
            classificationInstantiation: classificationInstantiation
        })

        const instanceVariableIsDefined = ClassificationDefinition.hasInstanceVariableDefined({
            classificationDefinition: classificationDefinition,
            instanceVariableName: instanceVariableName,
        })

        if( ! instanceVariableIsDefined ) {
            const classificationsName = ClassificationDefinition.getName({
                classificationDefinition: classificationDefinition
            })

            throw new InstanceVariableNotFoundError(`'${instanceVariableName}' is not an instance variable of ${classificationsName} Classification.`)
        }

        classificationInstantiation[instanceVariableName] = value
    }
}

module.exports = ClassificationInstantiation

