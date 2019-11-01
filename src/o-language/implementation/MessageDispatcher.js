const util = require('util')
const ClassificationDefinition = require('./classification-definition')
const ActiveClassification = require('./active-classification')
const ClassificationLookup = require('./classification-lookup')
const ClassificationInstantiation = require('./classification-instantiation')
const ClassificationObject = require('./classification-object')
const O_Object = require('./o-object')
const {OInstance} = require('./OInstance')
const {Classification} = require('./Classification')

class MessageDispatcher {

    constructor() {
        this.objectId = 0
        this.classificationClassification = Classification
        this.oInstanceClassification = OInstance
    }

    ////////////////////////////////////////////
    /// Boot
    ////////////////////////////////////////////


    /*
     * The classifications OInstance and Classification must be wired by hand at booting time since
     * the two of them are need to build an object.
     */
    initialize() {
        require('./Classification').setMessageDispatcher(this)
        require('./OInstance').setMessageDispatcher(this)

        ClassificationDefinition.initialize({ classificationDefinition: OInstance })
        ClassificationDefinition.initialize({ classificationDefinition: Classification })

        // Set this by hand to opmitize the method lookup and dispatch.
        OInstance.implementsBeforeAfterMethods = false

        this.classificationClassification = this.createObjectProxy()
        this.oInstanceClassification = this.createObjectProxy()

        const classificationInstantiation_1 = ClassificationDefinition.instantiateClassification({
            classificationDefinition: Classification
        })

        const oInstanceInstantiation_1 = ClassificationDefinition.instantiateClassification({ 
            classificationDefinition: OInstance
        })

        const classificationInstantiation_2 = ClassificationDefinition.instantiateClassification({
            classificationDefinition: Classification
        })

        const oInstanceInstantiation_2 = ClassificationDefinition.instantiateClassification({
            classificationDefinition: OInstance
        })

        O_Object.setAllInstantiatedClassifications({
            object: this.classificationClassification,
            instantiatedClassifications: [ classificationInstantiation_1, oInstanceInstantiation_1 ]
        })

        O_Object.setAllInstantiatedClassifications({
            object: this.oInstanceClassification,
            instantiatedClassifications: [ classificationInstantiation_2, oInstanceInstantiation_2 ]
        })

        classificationInstantiation_1.sourceClassification = this.classificationClassification
        oInstanceInstantiation_1.sourceClassification = this.oInstanceClassification
        classificationInstantiation_2.sourceClassification = this.classificationClassification
        oInstanceInstantiation_2.sourceClassification = this.oInstanceClassification

        // This is the equivalent of setting the instance variable "classificationDefinition"
        // for the Classifification instantiation of the Classification object
        classificationInstantiation_1.classificationDefinition = Classification

        // This is the equivalent of setting the instance variable "classificationDefinition"
        // for the Classifification instantiation of the OInstance object
        classificationInstantiation_2.classificationDefinition = OInstance


        // This is the internal handling of the classification definition within a classification
        // instantiation. For the time being it is handled separately than the previous instance
        // variable
        classificationInstantiation_1.definition = Classification
        oInstanceInstantiation_1.definition = OInstance
        classificationInstantiation_2.definition = Classification
        oInstanceInstantiation_2.definition = OInstance
    }

    getClassificationClassification() {
        return this.classificationClassification
    }

    getOInstanceClassification() {
        return this.oInstanceClassification
    }

    ////////////////////////////////////////////
    /// Classification lookup functions
    ////////////////////////////////////////////

    /*
     * Sets the given classificationObject as the initial classification in the classifications lookup
     * and evaluates the given closure.
     * After the closure evaluation restores the initial classification in the classifications lookup to
     * its previous value.
     */
    withClassificationDo({ object: object, classificationObject: classificationObject, closure: closure }) {
        ClassificationLookup.pushInitialClassification({
            object: object,
            classificationObject: classificationObject,
        })

        try {
            return closure.call(object)
        } finally {
            ClassificationLookup.popInitialClassification({
                object: object
            })
        }
    }

    /*
     * Sets the top most - 3 classification as the initial classification in the classifications lookup
     * and evaluates the given closure.
     * After the clsoure evaluation restores the initial classification in the classifications lookup to
     * its previous value.
     */
    duringPreviousClassificationDo({ object: object, closure: closure }) {
        const classificationObject = this.getPreviousClassificationOfObject({
            object: object
        })

        return this.withClassificationDo({
            object: object,
            classificationObject: classificationObject,
            closure: closure,
        })
    }

    ////////////////////////////////////////////
    /// Object methods
    ////////////////////////////////////////////

    /*
        Makes the given classificationObject to instantiate and push the given classification on top of
        its instantiated classifications even if it already behaves as that classification.
     */
    objectPushBehaviour({ object: object, classificationObject: classificationObject }) {
        ClassificationObject.attachBehaviour({
            classificationObject: classificationObject,
            object: object,
        })
    }

    /*
     * Makes the given object to stop behaving with the behaviour defined in the given classification.
     * An O instance that drops a classification is exactly the same as if it had not previously
     * had that classification and there is no way to distinguish bots scenarios.
     */
    objectDropBehaviour({ object: object, classificationObject: classificationObject }) {
        O_Object.detachClassificationObject({
            object: object,
            classificationObject: classificationObject
        })
    }

    /*
     * Answers true if the given object is behaving as the given classification, false otherwise.
     * This method would be the equivalent of isKindOf in the classic object oriented paradigm.
     */
    objectIsBehavingAs({ object: object, classificationObject: classificationObject }) {
        const classificationInstantiation = this.objectGetClassificationInstantiationOn({
            object: object,
            classificationObject: classificationObject,
        })

        return classificationInstantiation !== undefined
    }

    /*
     * Answers true if the given object is behaving as the given classification, false otherwise.
     * This method would be the equivalent of isKindOf in the classic object oriented paradigm.
     */
    objectGetClassificationInstantiationOn({ object: object, classificationObject: classificationObject }) {
        const classificationInstantiations =
            ClassificationInstantiation.getInstantiatedClassifications({
                object: object
            })

        const classificationInstantiation = classificationInstantiations.find( (eachClassification) => {
            return eachClassification.sourceClassification === classificationObject
        })

        return classificationInstantiation
    }

    /*
     * Answers true if the given object understands the given message, false otherwise.
     * An object responds to a message if any of its classifications does.
     */
    objectRespondsTo({ object: object, message: message }) {
        return object[message].isMethodNotFound !== true
    }

    /*
     * Returns an array with all of the classifications instantiated in the given object.
     */
    objectGetClassifications({ object: object }) {
        return ClassificationInstantiation.getInstantiatedClassifications({ object: object })
            .map( (eachClassification) => {
                return eachClassification.sourceClassification
            })
    }

    /*
     * Returns the classification active at the method where this.thisClassification() is called.
     *
     * Do not confuse with getActiveClassificationFrom(object).
     *
     * getActiveClassificationFrom(object) returns the top most classification in the call stack and is
     * an implementation method of the MessageDispatcher object.
     *
     * objectGetActiveClassification(object) returns the active classification at the method where
     *              this.thisClassification()
     * is called. That will be the second top most active frame in the call stack since the top most will
     * be the call to thisClassification() itself.
     */
    objectGetThisClassification({ object: object }) {
        return ActiveClassification.getActiveClassificationObjectIn({
            object: object,
            offset: -1,
        })
    }

    classificationInstanceVariablesDo({
        object: object, classificationObject: classificationObject, closure: closure
    }) {
        const classificationInstantiation = this.objectGetClassificationInstantiationOn({
            object: object,
            classificationObject: classificationObject,
        })

        ClassificationInstantiation.getInstanceVariables({ classificationInstantiation: classificationInstantiation })
            .forEach( (instanceVariableName) => {
                const value = ClassificationInstantiation.getInstanceVariableValue({
                    classificationInstantiation: classificationInstantiation,
                    instanceVariableName: instanceVariableName,
                })

                closure(instanceVariableName, value)
            })
    }


    /*
     * Returns the previous classification to the active at the method where this.previousClassification() is called.
     *
     * Another way to say it is that it returns the classification instantiated on the given object previous to the 
     * classification returned by objectGetActiveClassification(object).
     * 
     */
    getPreviousClassificationOfObject({ object: object }) {
        const activeInstantiatedClassification = ActiveClassification.in({
            object: object,
            offset: -1,
        })

        if( activeInstantiatedClassification === undefined ) { return undefined }

        const index  = ClassificationInstantiation.findClassificationIndex({
            object: object,
            classificationObject: activeInstantiatedClassification.sourceClassification,
        })

        const classifications = ClassificationInstantiation.getInstantiatedClassifications({ object: object })

        const previousClassification = classifications[ index + 1 ]

        if( previousClassification === undefined ) { return undefined }

        return previousClassification.sourceClassification
    }

    ////////////////////////////////////////////
    //////// Classification methods
    ////////////////////////////////////////////

    classificationGetDefinedMethodNames({ classificationDefinition: classificationDefinition }) {
        return ClassificationDefinition.getDefinedMethodNames({
            classificationDefinition: classificationDefinition
        })
    }

    classificationDefinesMethod({ classificationDefinition: classificationDefinition, methodName: methodName }) {
        return ClassificationDefinition.hasMethodDefined({
            classificationDefinition: classificationDefinition,
            methodName: methodName,
        })
    }

    classificationGetDefinedInstanceVariables({ classificationDefinition: classificationDefinition }) {
        return ClassificationDefinition.getDefinedInstanceVariables({
            classificationDefinition: classificationDefinition
        })
    }

    classificationSetDefinedInstanceVariables({
        classificationDefinition: classificationDefinition,
        instanceVariables: instanceVariables,
    }) {
        return ClassificationDefinition.setDefinedInstanceVariables({
            classificationDefinition: classificationDefinition,
            instanceVariables: instanceVariables,
        })
    }

    classificationGetAssumptions({ classificationDefinition: classificationDefinition }) {
        return ClassificationDefinition.getAssumptions({
            classificationDefinition: classificationDefinition
        })
    }

    classificationSetAssumptions({
        classificationDefinition: classificationDefinition, assumptions: classificationsObjects
    }) {
        ClassificationDefinition.setAssumptions({
            classificationDefinition: classificationDefinition,
            assumptions: classificationsObjects,
        })
    }

    classificationGetClassificationBehaviours({ classificationDefinition: classificationDefinition }) {
        return ClassificationDefinition.getClassificationBehaviours({
            classificationDefinition: classificationDefinition
        })
    }

    classificationGetImplementedClassifications({ classificationDefinition: classificationDefinition }) {
        return ClassificationDefinition.getImplementedProtocols({
            classificationDefinition: classificationDefinition
        })
    }

    classificationGetExpectedClassifications({ classificationDefinition: classificationDefinition }) {
        return ClassificationDefinition.getExpectedProtocols({
            classificationDefinition: classificationDefinition
        })
    }

    classificationSetClassificationBehaviours({
        classificationDefinition: classificationDefinition, classificationsObjects: classificationsObjects
    }) {
        ClassificationDefinition.setClassificationBehaviours({
            classificationDefinition: classificationDefinition,
            classificationsObjects: classificationsObjects,
        })
    }

    classificationGetName({ classificationObject: classificationObject }) {
        const classificationDefinition = ClassificationObject.getClassificationDefinition({
            classificationObject: classificationObject,
        })

        return ClassificationDefinition.getName({ classificationDefinition: classificationDefinition })
    }

    classificationDefinitionInitialize({ classificationDefinition: classificationDefinition }) {
        ClassificationDefinition.initialize({ classificationDefinition: classificationDefinition })
    }

    ////////////////////////////////////////////
    //////// Objects instantiation
    ////////////////////////////////////////////

    /*
     * This function hooks the getter of a receivers prop and looks up for the function to handle
     * the given prop among all of the classifications that the given object has instantiated on
     * itself.
     *
     * Note that in this method "this" is bound to the proxy object and not to the MessageDispatcherInstance.
     * This is because the proxy must be known to correctly bind the evaluation of the handler function
     * to it.
     */
    objectProxyGetProp(object, prop) {
        // Node calls the method named Symbol.for('nodejs.util.inspect.custom') to print an object.
        // The proxy handles this method calling the toString() on the OInstance object.
        const isNodePrintMethod =
            prop === Symbol.for('nodejs.util.inspect.custom') || prop === Symbol.toPrimitive

        if( isNodePrintMethod ) {
            const toStringMethod = 'toString'
            const lookupInitialIndex = ClassificationLookup.getInitialLookupIndex({ object: object })

            return ClassificationLookup.lookupMethod({
                lookupInitialIndex: lookupInitialIndex,
                object: object,
                methodName: toStringMethod,
                proxyObject: this,
            })
        }

        // These properties are part of the method dispatch implementation and must be handled out of the
        // regular method dispatch logic
        if( prop === 'impl' ) {
            return object[prop]
        }

        if( ActiveClassification.hasInstanceVariable({ object: object, instanceVariableName: prop }) ) {
            return ActiveClassification.getInstanceVariableValue({
                object: object,
                instanceVariableName: prop,
            })
        }

        const lookupInitialIndex = ClassificationLookup.getInitialLookupIndex({ object: object })

        return ClassificationLookup.lookupMethod({
            lookupInitialIndex: lookupInitialIndex,
            object: object,
            methodName: prop,
            proxyObject: this,
        })
    }

    /*
     * This function hooks the setter to a receivers prop and looks up for the function to handle
     * the given prop among all of the classifications that the given object has instantiated on
     * itself.
     *
     * Note that in this method "this" is bound to the proxy object and not to the MessageDispatcherInstance.
     * This is because the proxy must be known to correctly bind the evaluation of the handler function
     * to it.
     */
    objectProxySetProp(target, prop, value, receiver) {
        ActiveClassification.setInstanceVariableValue({
            object: target,
            instanceVariableName: prop,
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

    getNextObjectId() {
        this.objectId += 1

        return this.objectId
    }

    /*
     * Creates and returns a new object with no classification.
     *
     * Since it does not even have OInstance classification this object can not dynamically add any behaviour,
     * that can be accomplished wiring it up by hand, but except for not having the initial classifications
     * it is fully structured object.
     *
     */
    createObjectProxy() {
        const objectId = this.getNextObjectId()

        const object = Object.create(null)

        object.impl = {
            instantiatedClassifications: [],
            activeClassificationStack: [],
            initialClassificationLookup: [null],
            objectId: objectId,
        }

        return this.createProxyOn(object)
    }

    /*
     * Creates and returns a new O instance.
     *
     * The O instances behaves as the only classification OInstance, that allows to add
     * and drop other classifications.
     */
    createObject() {
        const object = this.createObjectProxy()

        const objectInitialClassifications = this.objectInitialClassifications({
            object: object
        })

        O_Object.setAllInstantiatedClassifications({
            object: object,
            instantiatedClassifications: objectInitialClassifications,
        })

        // Add some meaningfull display string to O instances.
        object.toString = function() {
            const classifications = MessageDispatcherInstance.objectGetClassifications({ object: this })

            const classificationNames = []

            classifications.forEach( (classificationObject) => {
                const classificationName = MessageDispatcherInstance.classificationGetName({
                    classificationObject: classificationObject
                })

                classificationNames.push( classificationName )
            })

            return `OInstance( ` + classificationNames.join(', ') + ` )`
        }

        return object
    }

    /*
     * Returns an array with the initial classifications of an object instantiated.
     */
    objectInitialClassifications({ object: object }) {
        const oInstanceInstantiation = ClassificationObject.instantiateClassification({
                classificationObject: this.oInstanceClassification
            })

        return [ oInstanceInstantiation ]   
    }
}

const MessageDispatcherInstance = new MessageDispatcher()

MessageDispatcherInstance.initialize()

module.exports = MessageDispatcherInstance