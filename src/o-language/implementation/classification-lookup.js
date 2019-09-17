const ClassificationInstantiation = require('./classification-instantiation')
const ActiveClassification = require('./active-classification')

class ClassificationLookup {
    /*
     * Pushes the given classification in the method lookup of the given object.
     */
    static pushInitialClassification({ object: object, classification: classification }) {
        object.impl.initialClassificationLookup.push(classification)
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
        const classification = ClassificationLookup.getInitialClassification({
            object: object
        })

        if( classification === null ) {
            return -1
        }

        return ClassificationInstantiation.findClassificationIndexOf({
            object: object,
            classificationObject: classification,
        })
    }

    /*
     * Finds the property value assigned to the given classification.
     *
     * If none is defined in the given classification returns undefined.
     */
    static findPropInClassificationObject({ classification: classification, propName: propName }) {
        const prototype = Object.getPrototypeOf(classification)

        return prototype[propName]
    }

    /*
     * Queries each classification instantiated in the receiver object to find
     * the first one that handles the propName.
     *
     * If the found prop value is not a function returns that value.

     * If the found prop value is a classification method returns a function wrapper on it that
     * correctly handles the classification method activation.
     *
     * If no prop value is found on any classification returns undefined. 
     */
    static findMethodAmongAllClassificationsOf({ lookupInitialIndex: lookupInitialIndex, object: receiver, propName: propName }) {
        const { prop, classification } = ClassificationLookup.findPropAmongAllClassificationsOf({
                lookupInitialIndex: lookupInitialIndex,
                object: receiver,
                propName: propName
            })

        if( typeof prop !== 'function' ) {
            return prop
        }

        return ClassificationLookup.createMethodProxy({
            method: prop,
            classification: classification
        })
    }

    /*
     * Queries each classification instantiated in the receiver object to find
     * the first one that handles the propName.
     *
     * If no prop value is found on any classification returns undefined. 
     */
    static findPropAmongAllClassificationsOf({ lookupInitialIndex: lookupInitialIndex, object: receiver, propName: propName }) {
        const classifications =
            ClassificationInstantiation.getInstantiatedClassificationsOf({ object: receiver })

        const classificationsCount = classifications.length

        for(let i = lookupInitialIndex; i < classificationsCount; i++) {
            const eachClassification = classifications[i]

            const prop = ClassificationLookup.findPropInClassificationObject({
                classification: eachClassification,
                propName: propName
            })

            if( prop !== undefined ) {
                return { prop: prop, classification: eachClassification }
            }
        }

        return { prop: undefined, classification: undefined }
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
    static createMethodProxy({ method: method, classification: classification }) {
        const methodProxyApply = function(targetFunction, thisArg, params) {
            const object = thisArg

            const initialLookup = ClassificationLookup.getInitialClassification({
                object: object
            })

            if( initialLookup !== null ) {
                ClassificationLookup.pushInitialClassification({
                    object: object,
                    classification: null
                })
            }

            ActiveClassification.pushInto({
                object: object,
                classification: classification
            })

            try {
                return targetFunction.call(object, ...params)
            } finally {
                ActiveClassification.popFrom({
                    object:
                    object
                })

                if( initialLookup !== null ) {
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
    static lookupPropIn(
        { lookupInitialIndex: lookupInitialIndex, object: object, propName: propName }
    ) {
        if( lookupInitialIndex === -1 ) {
            let propValue = ClassificationLookup.findPropInReceiver({
                object: object,
                propName: propName
            })

            if( propValue != undefined ) {
                return propValue
            }

            lookupInitialIndex = 0
        }

        return ClassificationLookup.findMethodAmongAllClassificationsOf({
            lookupInitialIndex: lookupInitialIndex,
            object: object,
            propName: propName
        })
    }

    /*
     * If the receiver object handles the propName by itself returns the handler function or prop
     * value.
     * Otherwise returns undefined.
     */
    static findPropInReceiver({ object: object, propName: propName }) {
        return object[propName]
    }
}

module.exports = ClassificationLookup

