const ClassificationDefinition = require('./classification-definition')

class ClassificationInstantiation {
    /*
     * Returns the index of the given classification in the array of the instantiated classifications of the
     * given object.
     */
    static findClassificationIndex({ object: object, classificationObject: classificationObject }) {
        const classificationInstantiations = ClassificationInstantiation.getInstantiatedClassifications({
            object: object
        })

        return classificationInstantiations.findIndex( (eachClassification) => {
                    return eachClassification.sourceClassification === classificationObject
                })
    }

    /*
     * Returns an array with all of the classifications instantiated in the given object.
     */
    static getInstantiatedClassifications({ object: object }) {
        return object.impl.instantiatedClassifications
    }

    static attachInstantiatedClassification({ object: object, classificationInstantiation: classificationInstantiation }) {
        const classificationInstantiations = ClassificationInstantiation.getInstantiatedClassifications({
            object: object
        })

        classificationInstantiations.unshift(classificationInstantiation)
    }

    /*
     * Returns the classification definition of a classificationInstantiation.
     * The classification definition is the class where the instance methods are defined.
     */
    static getClassificationDefinition({ classificationInstantiation: classificationInstantiation }) {
        return classificationInstantiation.constructor
    }

    static getSourceClassification({ instantiatedClassification: instantiateClassification }) {
        return instantiateClassification.sourceClassification
    }

    static getProp({ classificationInstantiation: classificationInstantiation, propName: propName }) {
        const classificationObject = ClassificationInstantiation.getClassificationObject({
            classificationInstantiation: classificationInstantiation
        })

        return classificationObject[propName]
    }

    static getClassificationObject({ classificationInstantiation: classificationInstantiation }) {
        return Object.getPrototypeOf( classificationInstantiation )
    }

    /*
     * Returns the classification definition of a classificationInstantiation.
     * The classification definition is the class where the instance methods are defined.
     */
    static getInstanceVariables({ classificationInstantiation: classificationInstantiation }) {
        const classificationDefinition = ClassificationInstantiation.getClassificationDefinition({
                classificationInstantiation: classificationInstantiation
            })

        return ClassificationDefinition.getInstanceVariables({
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
        return classificationInstantiation[instanceVariableName]
    }
}

module.exports = ClassificationInstantiation

