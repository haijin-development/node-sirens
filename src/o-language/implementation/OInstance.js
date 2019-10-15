let MessageDispatcherInstance

function setMessageDispatcher(messageDispatcher) {
    MessageDispatcherInstance = messageDispatcher
}

class OInstance {

    static definition() {
    }

    /// Initializing

    /*
     * Does nothing but serves as a null implementation for constructors that assume a polymorphic
     * initialization of objects.
     */
    initialize() {
    }

    /// Asking

    /*
     * Answers true if this O instance is behaving as the given classification, false otherwise.
     * This method would be the equivalent of isKindOf in the classic object oriented paradigm.
     */
    isBehavingAs(classification) {
        return MessageDispatcherInstance.objectIsBehavingAs({
            object: this, 
            classificationObject: classification,
        })
    }

    /*
     * Answers true if the receiver understands the given message, false otherwise.
     * An object responds to a message if any of its classifications does.
     */
    respondsTo(message) {
        return MessageDispatcherInstance.objectRespondsTo({
            object: this,
            message: message,
        })
    }

    compliesWith(protocol) {
        const objectClassifications = this.classifications()

        return objectClassifications.some( (classification) => {
            return classification.compliesWith({ protocol: protocol })
        })
    }

    /// Behaviours

    /*
     * Makes this O instance to adquire the behaviour defined in the given classification.
     * If the instance already behaves as the given classification this method does nothing.
     * This behaviour can be dropped from this instance by sending dropBehaviour(classification).
     */
    behaveAs(classification) {
        const isBehavingAs = MessageDispatcherInstance.objectIsBehavingAs({
            object: this, 
            classificationObject: classification,
        })

        if( isBehavingAs ) { return this }

        const getRecursiveAssumptions = classification.getRecursiveAssumptions()

        getRecursiveAssumptions.forEach( (eachClassification) => {
            this.behaveAs( eachClassification )
        })

        // This is to avoid the method lookup during this.pushBehaviour
        MessageDispatcherInstance.objectPushBehaviour({
            object: this,
            classificationObject: classification,
        })

        if( classification.definesMethod( 'afterInstantiation' ) ) {
            this.afterInstantiation()
        }        

        return this
    }

    /*
        Makes this O instance to instantiate and push the given classification on top of its instantiated 
        classifications even if it already behaves as that classification.
     */
    pushBehaviour(classification) {
        MessageDispatcherInstance.objectPushBehaviour({
            object: this,
            classificationObject: classification,
        })

        return this
    }

    /*
     * Makes this O instance to stop behaving with the behaviour defined in the given classification.
     * An O instance that drops a classification is exactly the same as if it had not previously
     * had that classification and there is no way to distinguish bots scenarios.
     */
    dropBehaviour(classification) {
        MessageDispatcherInstance.objectDropBehaviour({
            object: this,
            classificationObject: classification,
        })

        return this
    }

    /// Evaluating

    /*
     * Evaluates the given closure but starting the method lookup in the previous classification to the one
     * active in the method that called previousClassificationDo().
     */
    previousClassificationDo(closure) {
        return MessageDispatcherInstance.duringPreviousClassificationDo({
            object: this,
            closure: closure,
        })
    }

    /*
     * Instantiates the given classification to this object, evaluates the closure and drops the instantiated
     * classification.
     */
    duringClassificationDo(classification, closure) {
        this.behaveAs(classification)

        try {
            return closure.call(this)
        } finally {
            this.dropBehaviour(classification)
        }
    }

    classificationInstanceVariablesDo(classification, closure) {
        MessageDispatcherInstance.classificationInstanceVariablesDo({
            object: this,
            classificationObject: classification,
            closure: closure,
        })

        return this
    }

    /*
     * Evaluates the given closure starting the method lookup on the given classification.
     */
    withClassificationDo(classification, closure) {
        return MessageDispatcherInstance.withClassificationDo({
            object: this,
            classificationObject: classification,
            closure: closure,
        })
    }

    bindYourself(closure, ...params) {
        closure.call(this, ...params)

        return this
    }

    beforeMethod({ methodName: methodName, params: params, classification: classification }) {
    }

    afterMethod({ methodName: methodName, params: params, result: result, classification: classification }) {
    }

    /// Querying

    /*
     * Evaluates the given closure with this object as its parameters and returns this object.
     */
    yourself(closure) {
        closure(this)

        return this
    }

    /*
     * Returns an array of all of the instantiated classifications bound this object.
     */
    classifications() {
        return MessageDispatcherInstance.objectGetClassifications({
            object: this
        })
    }

    getClassificationNames() {
        return this.classifications().map( (classification) => {
            return classification.getName()
        })
    }

    /*
     * Returns the classification active in the method that called thisClassification().
     */
    thisClassification() {
        return MessageDispatcherInstance.objectGetThisClassification({
            object: this
        })
    }

    /*
     * Returns the previous classification to the active classification in the method that 
     * called previousClassification().
     */
    previousClassification() {
        return MessageDispatcherInstance.getPreviousClassificationOfObject({
            object: this
        })
    }
}

module.exports = {OInstance, setMessageDispatcher}