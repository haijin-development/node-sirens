const ClassificationDefinition = require('./classification-definition')
const ActiveClassification = require('./active-classification')
const ClassificationLookup = require('./classification-lookup')
const ClassificationInstantiation = require('./classification-instantiation')
const ClassificationObject = require('./classification-object')
const {OInstance} = require('./OInstance')
const {Classification} = require('./Classification')

class MessageDispatcher {

    constructor() {
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

        this.classificationClassification = this.createObjectProxy()
        this.oInstanceClassification = this.createObjectProxy()

        ClassificationDefinition.initialize({ classificationDefinition: OInstance })
        ClassificationDefinition.initialize({ classificationDefinition: Classification })

        const classificationInstantiation_1 = ClassificationDefinition.instantiateClassification({
            classificationDefinition: Classification
        })
        classificationInstantiation_1.sourceClassification = this.classificationClassification
        // This is the equivalent of setting the instance variable "classificationDefinition"
        // for the Classifification instantiation of the Classification object
        classificationInstantiation_1.classificationDefinition = Classification

        const oInstanceInstantiation_1 = ClassificationDefinition.instantiateClassification({ 
            classificationDefinition: OInstance
        })
        oInstanceInstantiation_1.sourceClassification = this.oInstanceClassification

        this.classificationClassification.impl.instantiatedClassifications = [
            classificationInstantiation_1,
            oInstanceInstantiation_1,
        ]

        const classificationInstantiation_2 = ClassificationDefinition.instantiateClassification({
            classificationDefinition: Classification
        })
        classificationInstantiation_2.sourceClassification = this.classificationClassification
        // This is the equivalent of setting the instance variable "classificationDefinition"
        // for the Classifification instantiation of the OInstance object
        classificationInstantiation_2.classificationDefinition = OInstance

        const oInstanceInstantiation_2 = ClassificationDefinition.instantiateClassification({
            classificationDefinition: OInstance
        })
        oInstanceInstantiation_2.sourceClassification = this.oInstanceClassification

        this.oInstanceClassification.impl.instantiatedClassifications = [
            classificationInstantiation_2,
            oInstanceInstantiation_2,
        ]
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
     * Makes the given object to adquire the behaviour defined in the given classification.
     * If the instance already behaves as the given classification this method does nothing.
     * This behaviour can be dropped from this instance by sending dropBehaviour(classification).
     */
    behaveAs({ object: object, classificationObject: classificationObject }) {
        if( this.objectIsBehavingAs({ object: object, classificationObject: classificationObject }) ) {
            return this
        }

        const allAssumptions = this.classificationRecursiveAssumptions({
            classificationObject: classificationObject
        })

        allAssumptions.push( classificationObject )

        allAssumptions.forEach( (eachClassification) => {
            if( ! this.objectIsBehavingAs({ object: object, classificationObject: eachClassification }) ) {
                ClassificationObject.attachBehaviour({
                    classificationObject: eachClassification,
                    object: object,
                })
            }
        })
    }

    classificationRecursiveAssumptions({ classificationObject: classificationObject }) {
        let allAssumptions = []

        const directAssumptions = classificationObject.getClassificationDefinition().assumes

        directAssumptions.forEach( (classificationObject) => {
            const assumptions = this.classificationRecursiveAssumptions({
                classificationObject: classificationObject
            })

            assumptions.forEach( (eachClassification) => {
                if( ! allAssumptions.includes( eachClassification ) ) {
                    allAssumptions.push( eachClassification )
                }
            })

            if( ! allAssumptions.includes( classificationObject ) ) {
                allAssumptions.push( classificationObject )
            }
        })

        return allAssumptions
    }

    /*
     * Makes the given object to stop behaving with the behaviour defined in the given classification.
     * An O instance that drops a classification is exactly the same as if it had not previously
     * had that classification and there is no way to distinguish bots scenarios.
     */
    objectDropBehaviour({ object: object, classificationObject: classificationObject }) {
        const filteredInstantiatedClassifications =
            ClassificationInstantiation.getInstantiatedClassifications({ object: object })
                .filter( (eachClassification) => {
                    return eachClassification.sourceClassification !== classificationObject
                })

        this.objectSetClassifications({
            object: object,
            instantiatedClassifications: filteredInstantiatedClassifications
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
        return object[message] !== undefined
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
     * Sets an array with all of the classifications instantiated on the given object.
     */
    objectSetClassifications({ object: object, instantiatedClassifications: instantiatedClassifications }) {
        object.impl.instantiatedClassifications = instantiatedClassifications
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
    objectGetActiveClassification({ object: object }) {
        const length = object.impl.activeClassificationStack.length

        const instantiatedClassification = ActiveClassification.in({ object: object, offset: -1 })

        return ClassificationInstantiation.getSourceClassification({
            instantiatedClassification: instantiatedClassification
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
        const length = object.impl.activeClassificationStack.length

        const activeClassification = object.impl.activeClassificationStack[ length - 2 ]

        if( activeClassification === undefined ) { return undefined }

        const index  = ClassificationInstantiation.findClassificationIndex({
            object: object,
            classificationObject: activeClassification.sourceClassification,
        })

        const classifications = ClassificationInstantiation.getInstantiatedClassifications({ object: object })

        const previousClassification = classifications[ index + 1 ]

        if( previousClassification === undefined ) { return undefined }

        return previousClassification.sourceClassification
    }

    ////////////////////////////////////////////
    //////// Classification methods
    ////////////////////////////////////////////

    classificationGetDefinedMethodNames({ classificationObject: classificationObject }) {
        return ClassificationObject.definedMethodNames({
            classificationObject: classificationObject
        })
    }

    classificationDefinesMethod({ classificationObject: classificationObject, methodName: methodName }) {
        return ClassificationObject.hasMethodDefined({
            classificationObject: classificationObject,
            methodName: methodName,
        })
    }

    classificationSetAssumptions({ classificationObject: classificationObject, assumptions: assumptions }) {
        const classificationDefinition = ClassificationObject.getClassificationDefinition({
            classificationObject: classificationObject,
        })

        ClassificationDefinition.setAssumptions({
            classificationDefinition: classificationDefinition,
            assumptions: assumptions,
        })
    }

    classificationGetName({ classificationObject: classificationObject }) {
        const classificationDefinition = ClassificationObject.getClassificationDefinition({
            classificationObject: classificationObject,
        })

        return ClassificationDefinition.getName({ classificationDefinition: classificationDefinition })
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

        return ClassificationLookup.lookupProp({
            lookupInitialIndex: lookupInitialIndex,
            object: object,
            propName: prop,
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

    /*
     * Creates and returns a new object with no classification.
     *
     * Since it does not even have OInstance classification this object can not dynamically add any behaviour,
     * that can be accomplished wiring it up by hand, but except for not having the initial classifications
     * it is fully structured object.
     *
     */
    createObjectProxy() {
        const object = Object.create(null)

        object.impl = {
            instantiatedClassifications: [],
            activeClassificationStack: [],
            initialClassificationLookup: [null],
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

        object.impl.instantiatedClassifications = objectInitialClassifications

        return object
    }

    createClassification({ classificationDefinition: classificationDefinition }) {
        ClassificationDefinition.initialize({ classificationDefinition: classificationDefinition })

        const object = this.createObject()

        object.behaveAs( this.getClassificationClassification() )

        object.setClassificationDefinition(classificationDefinition)

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