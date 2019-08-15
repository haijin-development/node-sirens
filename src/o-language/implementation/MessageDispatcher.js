let OInstance = null

class MessageDispatcher {

    constructor() {
        this.activeClassificationsStack = []
    }

    /*
     * Finds the property value assigned to the given classification.
     *
     * If none is defined in the given classification returns undefined.
     */
    findPropInClassification(classification, propName) {
        const prototype = Object.getPrototypeOf(classification)

        return prototype[propName]
    }

    /*
     * Creates a return a proxy on the given classification function that handles a message
     * send.
     *
     * This proxy hooks the function call to correctly active the method, updating which
     * classification is handling the function call.
     *
     * To know which classification is handling the method call is necessary to correctly
     * handle the statement
     *
     *              this.previousClassification()
     *
     * that dispatches the messages throught the classifications chain from the current classification
     * up to the last one.
     */
    createMethodProxy(classificationFunction, classification) {
        const methodProxyApply = function(targetFunction, thisArg, params) {
            this.activeClassificationsStack.push(classification)

            try {
                return targetFunction.call(thisArg, ...params)
            } finally {
                this.activeClassificationsStack.pop()
            }
        }


        const proxy = new Proxy(
            classificationFunction,
            {
                apply: methodProxyApply.bind(this)
            }
        )

        return proxy
    }

    /*
     * Queries each classification instantiated in the receiver object to find
     * the first one that handles the propName.
     *
     * If the prop value found is a classification method returns a function wrapper on it that
     * correctly handles the classification method activation.
     *
     * If none handle is found on any classification returns undefined. 
     */
    findMethodAmongAllClassificationsOf(proxy, receiver, propName) {
        const classifications = this.objectGetClassifications(receiver)

        for(const eachClassification of classifications) {
            const prop = this.findPropInClassification(eachClassification, propName)

            if( prop !== undefined ) {
                if( typeof prop !== 'function' ) {
                    return prop
                }

                return this.createMethodProxy(prop, eachClassification)
            }
        }

        return undefined
    }

    /*
     * If the receiver object handles the propName by itself returns the handler function or prop
     * value.
     * Otherwise returns undefined.
     */
    findPropInReceiver(proxy, receiver, propName) {
        return receiver[propName]
    }

    /*
     * Looks for a function to handle the given propName.
     * If the object has a handler for propName that it has the higher priority.
     * Otherwise each classification instantiated in the receiver object is queried to find
     * the first one that handles the propName. 
     */
    lookupPropIn(proxy, receiver, propName) {
        let propValue = this.findPropInReceiver(proxy, receiver, propName)

        if( propValue != undefined ) {
            return propValue
        }

        return this.findMethodAmongAllClassificationsOf(proxy, receiver, propName)
    }

    ////////////////////////////////////////////
    /// Object methods
    ////////////////////////////////////////////

    /*
     * Makes the given object to adquire the behaviour defined in the given classification.
     * If the instance already behaves as the given classification this method does nothing.
     * This behaviour can be dropped from this instance by sending dropBehaviour(classification).
     */
    behaveAs(object, classification) {
        if( this.objectIsBehavingAs(object, classification) ) {
            return this
        }

        const classificationCopy = new classification()

        classificationCopy.sourceClassification = classification

        this.objectGetClassifications(object).unshift(classificationCopy)
    }

    /*
     * Makes the given object to stop behaving with the behaviour defined in the given classification.
     * An O instance that drops a classification is exactly the same as if it had not previously
     * had that classification and there is no way to distinguish bots scenarios.
     */
    objectDropBehaviour(object, classification) {
        const filteredClassifications = object.classifications.filter( (eachClassification) => {
            return eachClassification.sourceClassification !== classification
        })

        this.objectSetClassifications(object, filteredClassifications)
    }

    /*
     * Answers true if the given object is behaving as the given classification, false otherwise.
     * This method would be the equivalent of isKindOf in the classic object oriented paradigm.
     */
    objectIsBehavingAs(object, aClassification) {
        const index = this.objectGetClassifications(object).findIndex( (eachClassification) => {
            return eachClassification.sourceClassification === aClassification
        })

        return index !== -1
    }

    /*
     * Answers true if the given object understands the given message, false otherwise.
     * An object responds to a message if any of its classifications does.
     */
    objectRespondsTo(object, message) {
        return object[message] !== undefined
    }


    /*
     * Answers an array with all of the classifications instantiated in the given object.
     */
    objectGetClassifications(object) {
        return object.classifications
    }

    /*
     * Sets an array with all of the classifications instantiated on the given object.
     */
    objectSetClassifications(object, classifications) {
        object.classifications = classifications
    }

    ////////////////////////////////////////////
    //////// Objects instantiation
    ////////////////////////////////////////////

    /*
     * This function hooks the getter of a receivers prop and looks up for the function to handle
     * the given prop among all of the classifications that the given object has instantiated on
     * itself.
     *
     * Note that in this method "this" is bound to the proxy object and not to the MessageDispatcher.
     * This is because the proxy must be known to correctly bind the evaluation of the handler function
     * to it.
     */
    objectProxyGetProp(receiver, prop) {
        return MessageDispatcherInstance.lookupPropIn(this, receiver, prop)
    }

    /*
     * This function hooks the setter to a receivers prop and looks up for the function to handle
     * the given prop among all of the classifications that the given object has instantiated on
     * itself.
     *
     * Note that in this method "this" is bound to the proxy object and not to the MessageDispatcher.
     * This is because the proxy must be known to correctly bind the evaluation of the handler function
     * to it.
     */
    objectProxySetProp(target, prop, value, receiver) {
        target[prop] = value

        return target
    }

    /*
     * Creates and returns a new MessageDispatcher proxy on the given object.
     *
     * This proxy hooks the getters of the given object props and instead of returning the
     * object property it performs the method lookup among the classifications that the given
     * object has instantiated on itself.
     */
    createProxyOn(object) {
        const handler = {
            get: this.objectProxyGetProp,
            set: this.objectProxySetProp,
        }

        const proxy = new Proxy(object, handler)

        handler.get = handler.get.bind(proxy)
        handler.set = handler.set.bind(proxy)

        return proxy
    }

    /*
     * Creates and returns a new O instance.
     *
     * The O instances behaves as the only classification OInstance, that allows to add
     * and drop other classifications.
     */
    createObject() {
        const object = Object.create(null)

        const objectInitialClassifications = this.objectInitialClassifications(object)

        this.objectSetClassifications(object, objectInitialClassifications)

        return this.createProxyOn(object)
    }

    /*
     * Returns an array with the initial classifications of an object instantiated.
     */
    objectInitialClassifications(object) {
        return [ this.newOInstanceClassification() ]   
    }

    /*
     * Instantiates and returns a new OInstance classification to be added to an object.
     */
    newOInstanceClassification() {
        if(OInstance === null) { OInstance = require('../OInstance') }

        const oClassification = new OInstance()

        oClassification.sourceClassification = OInstance

        return oClassification    
    }
}

const MessageDispatcherInstance = new MessageDispatcher()

module.exports = MessageDispatcherInstance