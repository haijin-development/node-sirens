const ClassificationDefinition = require('./classification-definition')

class ClassificationInstantiation {
    /*
     * Returns the index of the given classification in the array of the instantiated classifications of the
     * given object.
     */
    static findClassificationIndexOf({ object: object, classificationObject: classificationObject }) {
        const classificationInstantiations = ClassificationInstantiation.getInstantiatedClassificationsOf({
            object: object
        })

        return classificationInstantiations.findIndex( (eachClassification) => {
                    return eachClassification.sourceClassification === classificationObject
                })
    }

    /*
     * Returns an array with all of the classifications instantiated in the given object.
     */
    static getInstantiatedClassificationsOf({ object: object }) {
        return object.impl.instantiatedClassifications
    }

    static attachInstantiatedClassificationTo({ object: object, classificationInstantiation: classificationInstantiation }) {
        const classificationInstantiations = ClassificationInstantiation.getInstantiatedClassificationsOf({
            object: object
        })

        classificationInstantiations.unshift(classificationInstantiation)
    }

    /*
     * Returns the classification definition of a classificationInstantiation.
     * The classification definition is the class where the instance methods are defined.
     */
    static getClassificationDefinitionFrom({ classificationInstantiation: classificationInstantiation }) {
        return classificationInstantiation.constructor
    }

    /*
     * Returns the classification definition of a classificationInstantiation.
     * The classification definition is the class where the instance methods are defined.
     */
    static getInstanceVariablesFrom({ classificationInstantiation: classificationInstantiation }) {
        const classificationDefinition = ClassificationInstantiation.getClassificationDefinitionFrom({
                classificationInstantiation: classificationInstantiation
            })

        return ClassificationDefinition.getInstanceVariablesOf({
            classificationDefinition: classificationDefinition
        })
    }

    /*
     * Returns true if the given propName is an instance variable of the given classification instantiation, false otherwise.
     */
    static hasInstanceVariable({
        classificationInstantiation:classificationInstantiation, instanceVariableName: instanceVariableName
    }) {
        const instanceVariables = ClassificationInstantiation.getInstanceVariablesFrom({
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
        return classificationInstantiation[instanceVariableName]
    }
}

module.exports = ClassificationInstantiation

