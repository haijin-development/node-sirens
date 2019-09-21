const ClassificationInstantiation = require('./classification-instantiation')
const ActiveClassification = require('./active-classification')

class ClassificationLookup {
    /*
     * Pushes the given classification in the method lookup of the given object.
     */
    static pushInitialClassification({ object: object, classificationObject: classificationObject }) {
        object.impl.initialClassificationLookup.push( classificationObject )
    }

    /*
     * Pops the classification from the method lookup of the given object.
     */
    static popInitialClassification({ object: object }) {
        object.impl.initialClassificationLookup.pop()
    }

    /*
     * Returns the starting classification in the method lookup for the given object.
     */
    static getInitialClassification({ object: object }) {
        const length = object.impl.initialClassificationLookup.length

        return object.impl.initialClassificationLookup[ length - 1 ]
    }

    /*
     * Returns the index of the starting classification in the method lookup for the given object.
     */
    static getInitialLookupIndex({ object: object }) {
        const classificationObject = ClassificationLookup.getInitialClassification({
            object: object
        })

        if( classificationObject === null ) {
            return -1
        }

        return ClassificationInstantiation.findClassificationIndex({
            object: object,
            classificationObject: classificationObject,
        })
    }

    /*
     * Queries each classification instantiated in the receiver object to find
     * the first one that handles the propName.
     *
     * If no prop value is found on any classification returns undefined. 
     */
    static findMethodAmongAllClassifications({
        lookupInitialIndex: lookupInitialIndex, object: receiver, methodName: methodName
    }) {
        const instantiatedClassifications =
            ClassificationInstantiation.getInstantiatedClassifications({ object: receiver })

        const classificationsCount = instantiatedClassifications.length

        for(let i = lookupInitialIndex; i < classificationsCount; i++) {

            const eachInstantiatedClassification = instantiatedClassifications[i]

            const prop = ClassificationInstantiation.getMethod({
                classificationInstantiation: eachInstantiatedClassification,
                methodName: methodName,
            })

            if( prop !== undefined ) {
                return ClassificationLookup.createMethodProxy({
                    method: prop,
                    instantiatedClassification: eachInstantiatedClassification
                })
            }
        }

        return undefined
    }

    /*
     * Creates and returns a proxy on the given classification function that handles a message
     * send.
     *
     * This proxy hooks the function call to correctly activate the method and update which
     * classification is handling the function call.
     *
     * To know which classification is handling the method call is necessary to correctly
     * handle the statements
     *
     *              this.thisClassification()
     *              this.previousClassification()
     *              this.previousClassificationDo()
     *
     * that dispatch the messages throught the classifications chain from the current classification
     * up to the first one.
     */
    static createMethodProxy({ method: method, instantiatedClassification: instantiatedClassification }) {
        const methodProxyApply = function(targetFunction, thisArg, params) {
            const object = thisArg

            const initialClassificationObject = ClassificationLookup.getInitialClassification({
                object: object
            })

            if( initialClassificationObject !== null ) {
                ClassificationLookup.pushInitialClassification({
                    object: object,
                    instantiatedClassification: null
                })
            }

            ActiveClassification.pushInto({
                object: object,
                instantiatedClassification: instantiatedClassification
            })

            try {
                return targetFunction.call(object, ...params)
            } finally {
                ActiveClassification.popFrom({
                    object: object
                })

                if( initialClassificationObject !== null ) {
                    ClassificationLookup.popInitialClassification({
                        object: object
                    })
                }
            }
        }


        const proxy = new Proxy(
            method,
            {
                apply: methodProxyApply.bind(this)
            }
        )

        return proxy
    }

    /*
     * Looks for a function to handle the given propName.
     * If the object has a handler for propName that it has the higher priority.
     * Otherwise each classification instantiated in the receiver object is queried to find
     * the first one that handles the propName. 
     */
    static lookupMethod(
        { lookupInitialIndex: lookupInitialIndex, object: object, methodName: methodName }
    ) {
        if( lookupInitialIndex === -1 ) {
            let propValue = ClassificationLookup.getUnclassifiedMethod({
                object: object,
                methodName: methodName
            })

            if( propValue != undefined ) {
                return propValue
            }

            lookupInitialIndex = 0
        }

        return ClassificationLookup.findMethodAmongAllClassifications({
            lookupInitialIndex: lookupInitialIndex,
            object: object,
            methodName: methodName
        })
    }

    /*
     * If the receiver object handles the propName by itself returns the handler function or prop
     * value.
     * Otherwise returns undefined.
     */
    static getUnclassifiedMethod({ object: object, methodName: methodName }) {
        return object[methodName]
    }
}

module.exports = ClassificationLookup

