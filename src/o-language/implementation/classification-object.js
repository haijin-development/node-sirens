const ClassificationInstantiation = require('./classification-instantiation')
const ClassificationDefinition = require('./classification-definition')

class ClassificationObject {
    static attachBehaviour({ classificationObject: classificationObject, object: object }) {
        const classificationInstantiation = ClassificationObject.instantiateClassification({
            classificationObject: classificationObject
        })

        const classificationDefinition = classificationObject.getClassificationDefinition()

        ClassificationInstantiation.attachInstantiatedClassification({
            object: object,
            classificationInstantiation: classificationInstantiation,
        })

        if( classificationInstantiation.afterInstantiation !== undefined ) {
            object.afterInstantiation()
        }        
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

    static definedMethodNames({ classificationObject: classificationObject }) {
        return Object.getOwnPropertyNames(
            classificationObject.classificationDefinition.prototype
        )
    }

    static hasMethodDefined({ classificationObject: classificationObject, methodName: methodName }) {
        return typeof( classificationObject.classificationDefinition.prototype[methodName] ) === 'function'
    }

    static getClassificationDefinition({ classificationObject: classificationObject }) {
        const objectInstantiatedClassifications = classificationObject.impl.instantiatedClassifications

        // Find the classification instantiation of the given classificationObject
        for( const instantiatedClassification of objectInstantiatedClassifications ) {
            if( instantiatedClassification.sourceClassification === classificationObject ) {
                // The found classification instantiation is the one that has the instance variable
                // classificationDefinition.
                // Return that.

                //return instantiatedClassification.sourceClassification.classificationDefinition
            }
        }

        return classificationObject.getClassificationDefinition()
    }
}


module.exports = ClassificationObject

