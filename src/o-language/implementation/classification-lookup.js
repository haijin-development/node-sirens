const ClassificationInstantiation = require('./classification-instantiation')
const ActiveClassification = require('./active-classification')
const ClassificationObject = require('./classification-object')
const O_Object = require('./o-object')

class ClassificationLookup {
    /*
     * Pushes the given classification in the method lookup of the given object.
     */
    static pushInitialClassification({ object: object, classificationObject: classificationObject }) {
        return O_Object.pushLookupInitialClassification({
            object: object,
            classificationObject: classificationObject,
        })
    }

    /*
     * Pops the classification from the method lookup of the given object.
     */
    static popInitialClassification({ object: object }) {
        return O_Object.popLookupInitialClassification({
            object: object
        })
    }

    /*
     * Returns the starting classification in the method lookup for the given object.
     */
    static getInitialClassification({ object: object }) {
        return O_Object.getLookupInitialClassification({
            object: object
        })
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

    static mustCallBeforeAndAfterMethod({
        object: object, method: method, instantiatedClassification: instantiatedClassification
    }) {
        // The following methods are a special case because they would generate an infinite recursion
        // since the proxy classification implements them
        if( ['beforeMethod', 'afterMethod', 'previousClassificationDo'].includes(method.name) ) {
            return false
        }

        const classificationObjectOwningMethod = ClassificationInstantiation.getSourceClassification({
            instantiatedClassification: instantiatedClassification
        })

        // The .afterInstantiation is a special case because it always gets called from from the
        // OInstance classification. If its the call to the proxy classification do not call beforeMethod
        if( method.name === 'afterInstantiation' ) {
            const mostRecentClassification = ClassificationObject.getMostRecentClassificationObject({
                object: object
            })

            if( classificationObjectOwningMethod === mostRecentClassification ) {
                return false
            }
        }

        // If the call comes from the proxy classification do not call .beforeMethod since it would
        // generate an infinite recursion
        {
            let activeClassificationObject = ActiveClassification.getActiveClassificationObjectIn({
                object: object
            })

            if( activeClassificationObject === undefined ) {
                activeClassificationObject = ClassificationObject.getMostRecentClassificationObject({
                    object: object
                })
            }
            if( classificationObjectOwningMethod === activeClassificationObject ) {
                return false
            }            
        }

        // Otherwise call .beforeMethod for the proxy classification to hook it.
        return true
    }

    static activateMethod({
        object: object, method: method, params: params, instantiatedClassification: instantiatedClassification
    }) {
        const methodName = method.name

        const mustCallBeforeAndAfterMethod = ClassificationLookup.mustCallBeforeAndAfterMethod({
            object: object,
            method: method,
            instantiatedClassification: instantiatedClassification,
        })

        if( mustCallBeforeAndAfterMethod ) {
            const classificationObjectOwningMethod =
                ClassificationInstantiation.getSourceClassification({
                    instantiatedClassification: instantiatedClassification
                })

            const beforeMethodResult = O_Object.objectCallMethod({
                proxyObject: object,
                methodName: 'beforeMethod',
                params: [
                    {
                        methodName: methodName,
                        params: params,
                        classification: classificationObjectOwningMethod,
                    }
                ]
            })

            if( beforeMethodResult !== undefined && beforeMethodResult.methodName === null ) {
                return beforeMethodResult
            }

            if( beforeMethodResult !== undefined && beforeMethodResult.params !== undefined ) {
                if( ! Array.isArray( beforeMethodResult.params ) ) {
                    throw new Error(`Expecting an array in .params property.`)
                }

                params = beforeMethodResult.params
            }
        }

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

        let methodResult

        try {

            methodResult = method.call(object, ...params)

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

        if( mustCallBeforeAndAfterMethod ) {
            const classificationObjectOwningMethod =
                ClassificationInstantiation.getSourceClassification({
                    instantiatedClassification: instantiatedClassification
                })

            const afterMethodResult = object.afterMethod({
                methodName: methodName,
                params: params,
                result: methodResult,
                classification: classificationObjectOwningMethod,
            })

            if( afterMethodResult !== undefined && afterMethodResult.result !== undefined ) {
                methodResult = afterMethodResult.result
            }
        }

        return methodResult
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
            const method = targetFunction

            return ClassificationLookup.activateMethod({
                object: object,
                method: method,
                params: params,
                instantiatedClassification: instantiatedClassification,
            })
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

