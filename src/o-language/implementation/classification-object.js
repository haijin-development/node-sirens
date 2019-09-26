const ClassificationInstantiation = require('./classification-instantiation')
const ClassificationDefinition = require('./classification-definition')
const O_Object = require('./o-object')

class ClassificationObject {
    static attachBehaviour({ classificationObject: classificationObject, object: object }) {
        const instantiatedClassification = ClassificationObject.instantiateClassification({
            classificationObject: classificationObject
        })

        const classificationDefinition = ClassificationInstantiation.getClassificationDefinition({
            classificationInstantiation: instantiatedClassification,
        })

        O_Object.attachInstantiatedClassification({
            object: object,
            instantiatedClassification: instantiatedClassification,
            classificationDefinition: classificationDefinition,
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
        const classificationClassificationInstantiation = 
            O_Object.getLessRecentInstantiatedClassification({
                object: classificationObject,
                offset: -1,
            })

        const classificationDefinition = ClassificationInstantiation.getInstanceVariableValue({
            classificationInstantiation: classificationClassificationInstantiation,
            instanceVariableName: 'classificationDefinition'
        })

        return classificationDefinition
    }

    static getMostRecentClassificationObject({ object: object }) {
        const firstInstantiatedClassification = O_Object.getMostRecentInstantiatedClassification({
                object: object
            })

        return ClassificationInstantiation.getSourceClassification({
            classificationInstantiation: firstInstantiatedClassification
        })
    }    
}


module.exports = ClassificationObject

