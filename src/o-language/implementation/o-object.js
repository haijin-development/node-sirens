const ClassificationDefinition = require('./classification-definition')

class O_Object {
    /// Instantiated classifications

    static attachInstantiatedClassification({
        object: object,
        instantiatedClassification: instantiatedClassification,
        classificationDefinition: classificationDefinition,
    }) {
        object.impl.instantiatedClassifications.unshift(instantiatedClassification)

        const implementsBeforeAfterMethods = ClassificationDefinition.implementsBeforeAfterMethods({
            classificationDefinition: classificationDefinition
        })

        // if classificationDefinition.implementsBeforeAfterMethods === false keep the previous value
        if( implementsBeforeAfterMethods ) {
            object.impl.implementsBeforeAfterMethods = true
        }
    }

    static detachClassificationObject({
        object: object, classificationObject: classificationObject
    }) {
        let objectImplementsBeforeAfterMethods = false

        const remainingInstantiatedClassifications = object.impl.instantiatedClassifications
            .filter( (instantiatedClassification) => {

                const keepThisClassificationInstantiation =
                    instantiatedClassification.sourceClassification !== classificationObject

                if( keepThisClassificationInstantiation ) {
                    const thisClassificationImplementsBeforeAfterMethods =
                        ClassificationDefinition.implementsBeforeAfterMethods({
                            classificationDefinition: instantiatedClassification.definition
                        })

                    objectImplementsBeforeAfterMethods = 
                        objectImplementsBeforeAfterMethods || thisClassificationImplementsBeforeAfterMethods

                }

                return keepThisClassificationInstantiation
            })

        object.impl.instantiatedClassifications = remainingInstantiatedClassifications

        delete object.impl.implementsBeforeAfterMethods

        // if classificationDefinition.implementsBeforeAfterMethods === false keep the previous value
        if( objectImplementsBeforeAfterMethods ) {
            object.impl.implementsBeforeAfterMethods = objectImplementsBeforeAfterMethods
        }
    }

    static getAllInstantiatedClassifications({ object: object }) {
        return object.impl.instantiatedClassifications.slice()
    }

    /*
     * Sets an array with all of the classifications instantiated on the given object.
     */
    static setAllInstantiatedClassifications({
        object: object, instantiatedClassifications: instantiatedClassifications
    }) {
        object.impl.instantiatedClassifications = instantiatedClassifications.slice()
    }

    static getMostRecentInstantiatedClassification({ object: object, offset: offset }) {
        if( offset === undefined ) {
            offset = 0
        }

        const index = - offset

        return object.impl.instantiatedClassifications[offset]
    }

    static getLessRecentInstantiatedClassification({ object: object, offset: offset }) {
        if( offset === undefined ) {
            offset = 0
        }

        const index = object.impl.instantiatedClassifications.length - 1 + offset

        return object.impl.instantiatedClassifications[index]
    }

    /// Active instantiated classification stack

    static pushActiveInstantiatedClassification({
        object: object,
        instantiatedClassification: instantiatedClassification
    }) {
        object.impl.activeClassificationStack.push( instantiatedClassification )
    }

    static popActiveInstantiatedClassification({ object: object }) {
        object.impl.activeClassificationStack.pop()
    }

    static getMostRecentActiveInstantiatedClassification({ object: object, offset: offset }) {
        if( offset === undefined ) { offset = 0 }

        const length = object.impl.activeClassificationStack.length

        return object.impl.activeClassificationStack[ length - 1 + offset ]
    }

    /// Classification lookup

    /*
     * Pushes the given classification in the classifications lookup stack of the given object.
     */
    static pushLookupInitialClassification({ object: object, classificationObject: classificationObject }) {
        object.impl.initialClassificationLookup.push( classificationObject )
    }

    /*
     * Pops the classification from the method lookup of the given object.
     */
    static popLookupInitialClassification({ object: object }) {
        object.impl.initialClassificationLookup.pop()
    }

    /*
     * Returns the starting classification in the method lookup for the given object.
     */
    static getLookupInitialClassification({ object: object }) {
        const length = object.impl.initialClassificationLookup.length

        return object.impl.initialClassificationLookup[ length - 1 ]
    }

    /// Calling methods

    static objectCallMethod({ proxyObject: proxyObject, methodName: methodName, params: params }) {
        return proxyObject[methodName](...params)
    }

    /// beforeMethod/afterMethod optimization

    static implementsBeforeAfterMethods({ object: object }) {
        return object.impl.implementsBeforeAfterMethods === true
    }

    /*
        Method(`
            Sets the given value to the property of the given object instead of
            setting it to the object active classification.
        `)
    */
    static setUnclassifiedProperty({ object: proxyObject, name: propertyName, value: value }) {
        proxyObject.impl.object[propertyName] = value
    }
}


module.exports = O_Object

