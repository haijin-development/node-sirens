let OInstance = null

class MessageDispatcher {

    ////////////////////////////////////////////
    /// Active classification functions
    ////////////////////////////////////////////

    pushActiveClassificationInto(object, classification) {
        object.impl.activeClassificationStack.push(classification)
    }

    popActiveClassificationFrom(object) {
        object.impl.activeClassificationStack.pop()
    }

    getActiveClassificationFrom(object) {
        const length = object.impl.activeClassificationStack.length

        return object.impl.activeClassificationStack[ length - 1 ]
    }

    ////////////////////////////////////////////
    /// Classification lookup functions
    ////////////////////////////////////////////

    pushInitialClassificationLookup(object, classification) {
        object.impl.initialClassificationLookup.push(classification)
    }

    popInitialClassificationLookup(object) {
        object.impl.initialClassificationLookup.pop()
    }

    getInitialClassificationLookup(object) {
        const length = object.impl.initialClassificationLookup.length

        return object.impl.initialClassificationLookup[ length - 1 ]
    }

    getInitialClassificationLookupIndex(object) {
        const classification = this.getInitialClassificationLookup(object)

        if( classification === null ) {
            return -1
        }

        return this.findClassificationIndexOf(object, classification)
    }

    findClassificationIndexOf(object, classification) {
        return this.objectGetClassifications(object).findIndex( (eachClassification) => {
            return eachClassification.sourceClassification === classification
        })
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
            const object = thisArg

            this.pushActiveClassificationInto(object, classification)

            try {
                return targetFunction.call(thisArg, ...params)
            } finally {
                this.popActiveClassificationFrom(object)
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
    findMethodAmongAllClassificationsOf(lookupInitialIndex, proxy, receiver, propName) {
        const classifications = this.objectGetClassifications(receiver)

        const classificationsCount = classifications.length

        for(let i = lookupInitialIndex; i < classificationsCount; i++) {
            const eachClassification = classifications[i]

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
    lookupPropIn(
        {lookupInitialIndex: lookupInitialIndex, proxy: proxy, receiver: receiver, propName: propName}
    ) {
        if( lookupInitialIndex === -1 ) {
            let propValue = this.findPropInReceiver(proxy, receiver, propName)

            if( propValue != undefined ) {
                return propValue
            }

            lookupInitialIndex = 0
        }

        return this.findMethodAmongAllClassificationsOf(lookupInitialIndex, proxy, receiver, propName)
    }


    ////////////////////////////////////////////
    /// Classification lookup functions
    ////////////////////////////////////////////

    /*
     * Returns true if the given propName is an instance variable of the active classification, false otherwise.
     */
    isInstanceVariableInActiveClassification(object, propName) {
        const activeClassification = this.getActiveClassificationFrom(object)

        if(activeClassification === undefined) {
            return false
        }

        return this.isInstanceVariableOfClassificationInstantiation(activeClassification, propName)
    }

    /*
     * Returns true if the given propName is an instance variable of the given classification instantiation, false otherwise.
     */
    isInstanceVariableOfClassificationInstantiation(classificationInstantiation, propName) {
        const classification = classificationInstantiation.sourceClassification

        return this.isInstanceVariableOfClassification(classification, propName)
    }

    /*
     * Returns true if the given propName is an instance variable of the given classification, false otherwise.
     */
    isInstanceVariableOfClassification(classification, propName) {
        const instanceVariables = classification.instanceVariables

        return instanceVariables.includes(propName)
    }

    /*
     * Returns the value of the instance variable in the active classification.
     * Assumes that the instantace variable exists in that classification.
     * That assumption might be tested first with isInstanceVariableInActiveClassification(object, instVarName).
     */
    getInstanceVariableFromActiveClassification(object, instVarName) {
        const activeClassification = this.getActiveClassificationFrom(object)

        if(activeClassification === undefined) {
            return undefined
        }

        return this.getInstanceVariableFromClassificationInstantiation(activeClassification, instVarName)
    }

    /*
     * Returns the value of the instance variable int the given classificationInstantiation.
     * Assumes that the instantace variable exists in that classificationInstantiation.
     * That assumption might be tested first with isInstanceVariableOfClassificationInstantiation.
     */
    getInstanceVariableFromClassificationInstantiation(classificationInstantiation, instVarName) {
        return classificationInstantiation[instVarName]
    }

    /*
     * Set the prop value in the current classification instantiation.
     * The instance variables do not belong to an object but to an instantiation of a classification in that
     * object.
     */
    setInstanceVariableInActiveClassification(
        {proxy: proxy, receiver: receiver, propName: propName, value: value}
    ) {
        const activeClassification = this.getActiveClassificationFrom(receiver)

        if( activeClassification === undefined ) {
            receiver[propName] = value
            return
        }

        if( ! activeClassification.sourceClassification.instanceVariables.includes(propName) ) {
            const classificationsName = activeClassification.sourceClassification.name

            throw new Error(`'${propName}' is not an instance variable of ${classificationsName} Classification.`)
        }

        activeClassification[propName] = value
    }

    /*
     * Set the given classification as the initial classification in the classifications lookup
     * and evaluates the given closure.
     * After the evaluations restores the initial classification in the classifications lookup to
     * its previous value.
     */
    duringClassificationDo(object, classification, closure) {
        this.pushInitialClassificationLookup(object, classification)

        try {
            closure.call(object)
        } finally {
            this.popInitialClassificationLookup(object)
        }
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

        const classificationInstantiation = this.instantiateClassificationFor(classification)

        classificationInstantiation.sourceClassification = classification

        this.objectGetClassifications(object).unshift(classificationInstantiation)
    }

    /*
     * Makes the given object to stop behaving with the behaviour defined in the given classification.
     * An O instance that drops a classification is exactly the same as if it had not previously
     * had that classification and there is no way to distinguish bots scenarios.
     */
    objectDropBehaviour(object, classification) {
        const filteredClassifications = this.objectGetClassifications(object).filter( (eachClassification) => {
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
        return object.impl.classifications
    }

    /*
     * Sets an array with all of the classifications instantiated on the given object.
     */
    objectSetClassifications(object, classifications) {
        object.impl.classifications = classifications
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
        // These properties are part of the method dispatch implementation and must be handled out of the
        // regular method dispatch logic
        if( prop === 'impl' ) {
            return receiver[prop]
        }

        if( MessageDispatcherInstance.isInstanceVariableInActiveClassification(receiver, prop) ) {
            return MessageDispatcherInstance.getInstanceVariableFromActiveClassification(receiver, prop)
        }

        const lookupInitialIndex = MessageDispatcherInstance.getInitialClassificationLookupIndex(receiver)

        return MessageDispatcherInstance.lookupPropIn({
            lookupInitialIndex: lookupInitialIndex,
            proxy: this,
            receiver: receiver,
            propName: prop,
        })
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
        MessageDispatcherInstance.setInstanceVariableInActiveClassification({
            proxy: this,
            receiver: target,
            propName: prop,
            value: value,
        })

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

        object.impl = {
            classifications: objectInitialClassifications,
            activeClassificationStack: [],
            initialClassificationLookup: [null],
        }

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

        return this.instantiateClassificationFor(OInstance)
    }

    /*
     * Instantiates a classification for the given object.
     */
    instantiateClassificationFor(classification) {
        let instanceVariables = []

        if( classification.initialized !== true ) {
            if( classification.definition != undefined ) {
                classification.definition()
            } else {
                classification.instanceVariables = []
            }

            classification.initialized = true
        }

        const instantiatedClassification = new classification()

        instantiatedClassification.sourceClassification = classification

        return instantiatedClassification
    }
}

const MessageDispatcherInstance = new MessageDispatcher()

module.exports = MessageDispatcherInstance