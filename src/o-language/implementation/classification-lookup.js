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
        lookupInitialIndex: lookupInitialIndex,
        object: receiver,
        methodName: methodName,
        proxyObject: proxyObject
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
                    instantiatedClassification: eachInstantiatedClassification,
                    proxyObject: proxyObject,
                })
            }
        }

        return undefined
    }

    static mustCallBeforeAndAfterMethod({
        object: object, methodName: methodName, instantiatedClassification: instantiatedClassification
    }) {
        // If the given object does not implement beforeMethod or afterMethod just skip them
        if( ! O_Object.implementsBeforeAfterMethods({ object: object }) ) {
            return false
        }

        // The following methods are a special case because they would generate an infinite recursion
        // since the proxy classification implements them
        if( ['beforeMethod', 'afterMethod', 'previousClassificationDo', 'thisClassification'].includes(methodName) ) {
            return false
        }

        // If instantiatedClassification === null we are executing a methodNotFound.
        // In this case always call beforeMethod and afterMethod to allow the proxies to handle
        // the methodNotFound.
        if( instantiatedClassification === null ) {
            return true
        }

        // The .afterInstantiation is a special case because it always gets called from from the
        // OInstance classification. If its the call to the proxy classification do not call beforeMethod
        if( methodName === 'afterInstantiation' ) {
            const classificationObjectOwningMethod = ClassificationInstantiation.getSourceClassification({
                classificationInstantiation: instantiatedClassification
            })

            const mostRecentClassification = ClassificationObject.getMostRecentClassificationObject({
                object: object
            })

            if( classificationObjectOwningMethod === mostRecentClassification ) {
                return false
            }
        }

        // Otherwise call .beforeMethod for the proxy classification to hook it.
        return true
    }

    static callBeforeMethod({
        proxyObject: proxyObject,
        methodName: methodName,
        params: params,
        instantiatedClassification: instantiatedClassification,
    }) {
        let classificationObjectOwningMethod

        const result = {
            callMethod: methodName,
            callParams: params,
        }

        if( instantiatedClassification !== null ) {
            classificationObjectOwningMethod =
                ClassificationInstantiation.getSourceClassification({
                    classificationInstantiation: instantiatedClassification
                })
        }

        const beforeMethodResult = O_Object.objectCallMethod({
            proxyObject: proxyObject,
            methodName: 'beforeMethod',
            params: [
                {
                    methodName: methodName,
                    params: params,
                    classification: classificationObjectOwningMethod,
                }
            ]
        })

        if( beforeMethodResult === undefined ) {
            return result
        }

        if( beforeMethodResult.callMethod !== null
            &&
            beforeMethodResult.callParams !== undefined
            &&
            ! Array.isArray( beforeMethodResult.callParams )
          ) {
            throw new Error(`Expecting an array in .params property.`)
        }

        if( beforeMethodResult.callMethod !== undefined ) {
            result.callMethod = beforeMethodResult.callMethod
        }

        if( beforeMethodResult.callParams !== undefined ) {
            result.callParams = beforeMethodResult.callParams
        }

        return result
    }

    static callMethod({
        object: object,
        method: method,
        params: params,
        instantiatedClassification: instantiatedClassification,
    }) {
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

            return method.call(object, ...params)

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

    static callAfterMethod({
        proxyObject: proxyObject,
        methodName: methodName,
        params: params,
        methodResult: methodResult,
        instantiatedClassification: instantiatedClassification
    }) {
        let classificationObjectOwningMethod

        const result = {
            callResult: undefined,
        }

        if( instantiatedClassification !== null ) {
            classificationObjectOwningMethod =
                ClassificationInstantiation.getSourceClassification({
                    classificationInstantiation: instantiatedClassification
                })
        }

        const afterMethodResult = O_Object.objectCallMethod({
            proxyObject: proxyObject,
            methodName: 'afterMethod',
            params: [
                {
                    methodName: methodName,
                    params: params,
                    result: methodResult,
                    classification: classificationObjectOwningMethod,
                }
            ]
        })

        if( afterMethodResult !== undefined && afterMethodResult.callResult !== undefined ) {
            result.callResult = afterMethodResult.callResult
        }

        return result
    }

    static activateMethod({
        object: object,
        method: method,
        params: params,
        instantiatedClassification: instantiatedClassification,
        proxyObject: proxyObject,
        methodName: methodName,
    }) {
        const mustCallBeforeAndAfterMethod = ClassificationLookup.mustCallBeforeAndAfterMethod({
            object: object,
            methodName: methodName,
            instantiatedClassification: instantiatedClassification,
        })

        let mustCallMethod = true 
        let beforeMethodResult
        let methodResult

        if( mustCallBeforeAndAfterMethod ) {
            beforeMethodResult = ClassificationLookup.callBeforeMethod({
                methodName: methodName,
                params: params,
                instantiatedClassification: instantiatedClassification,
                proxyObject: proxyObject,
            })

            params = beforeMethodResult.callParams

            mustCallMethod = beforeMethodResult.callMethod !== null
        }

        if( mustCallMethod ) {
            if( method === null ) {
                throw new Error(`Method not found .${methodName.toString()}() in object ${object.toString()}`)
            }

            if( beforeMethodResult !== undefined && beforeMethodResult.callMethod !== methodName ) {

                methodResult = O_Object.objectCallMethod({
                    proxyObject: proxyObject,
                    methodName: beforeMethodResult.callMethod,
                    params: params
                })

            } else {

                methodResult = ClassificationLookup.callMethod({
                    object: object,
                    method: method,
                    params: params,
                    instantiatedClassification: instantiatedClassification
                })

            }

        }

        if( mustCallBeforeAndAfterMethod ) {
            const afterMethodResult = ClassificationLookup.callAfterMethod({
                proxyObject: proxyObject,
                methodName: methodName,
                params: params,
                methodResult: methodResult,
                instantiatedClassification: instantiatedClassification
            })

            if( afterMethodResult.callResult !== undefined  ) {
                methodResult = afterMethodResult.callResult
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
    static createMethodProxy({
        method: method,
        instantiatedClassification: instantiatedClassification,
        proxyObject: proxyObject
    }) {
        const methodProxyApply = function(targetFunction, thisArg, params) {
            const object = thisArg
            const method = targetFunction

            return ClassificationLookup.activateMethod({
                object: object,
                method: method,
                params: params,
                instantiatedClassification: instantiatedClassification,
                proxyObject: proxyObject,
                methodName: method.name,
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
    static lookupMethod({
        lookupInitialIndex: lookupInitialIndex,
        object: object,
        methodName: methodName,
        proxyObject: proxyObject
    }) {
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

        let foundMethod = ClassificationLookup.findMethodAmongAllClassifications({
            lookupInitialIndex: lookupInitialIndex,
            object: object,
            methodName: methodName,
            proxyObject: proxyObject,
        })

        if( foundMethod === undefined ) {
            const methodNotFoundFunction = (...params) => {
                return this.onMethodNotFound({
                    object: object,
                    methodName: methodName,
                    params: params,
                    proxyObject: proxyObject,
                })
            }

            methodNotFoundFunction.isMethodNotFound = true

            foundMethod = methodNotFoundFunction
        }

        return foundMethod
    }

    static onMethodNotFound({
        object: object,
        methodName: methodName,
        params: params,
        proxyObject: proxyObject,
    }) {
        return this.activateMethod({
            object: object,
            method: null,
            params: params,
            instantiatedClassification: null,
            proxyObject: proxyObject,
            methodName: methodName,
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

