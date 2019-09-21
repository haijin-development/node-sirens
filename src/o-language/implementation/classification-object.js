const ClassificationInstantiation = require('./classification-instantiation')
const ClassificationDefinition = require('./classification-definition')

class ClassificationObject {
    static attachBehaviour({ classificationObject: classificationObject, object: object }) {
        const classificationInstantiation = ClassificationObject.instantiateClassification({
            classificationObject: classificationObject
        })

        ClassificationInstantiation.attachInstantiatedClassification({
            object: object,
            classificationInstantiation: classificationInstantiation,
        })
    }

    /*
     * Instantiates a classification from the given classificationObject.
     */
    static instantiateClassification({ classificationObject: classificationObject }) {
        const classificationDefinition = ClassificationObject.getClassificationDefinition({
            classificationObject: classificationObject,
        })

        const instantiatedClassification = ClassificationDefinition.instantiateClassification({
            classificationDefinition: classificationDefinition
        })

        instantiatedClassification.sourceClassification = classificationObject

        return instantiatedClassification
    }

    static getClassificationDefinition({ classificationObject: classificationObject }) {
        const objectInstantiatedClassifications = classificationObject.impl.instantiatedClassifications

        // The first classification instantiated by a classification object is OInstance,
        // the second one is Classification
        const classificationInstantiationIndex = objectInstantiatedClassifications.length - 2

        const classificationClassificationInstantiation = 
            objectInstantiatedClassifications[classificationInstantiationIndex]

        const classificationDefinition = ClassificationInstantiation.getInstanceVariableValue({
            classificationInstantiation: classificationClassificationInstantiation,
            instanceVariableName: 'classificationDefinition'
        })

        return classificationDefinition
    }
}


module.exports = ClassificationObject

