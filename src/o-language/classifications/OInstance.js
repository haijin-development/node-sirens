const Classification = require('./Classification')
const MessageDispatcher = require('../implementation/MessageDispatcher')

/*
 * This is the only behaviour that an instance has when its instantiated.
 * 
 * An O instance by itself contains only the methods to be able to dynamically add and drop behaviours
 * through classifications.
 *
 * In the O language an O instance has nothing else but its identity, all of its behaviour is
 * dynamically added after its instantiation though classifications, and those classifications
 * can be dropped as well.
 */
class OInstance extends Classification {

    /// Initializing

    /*
     * Does nothing but serves as a null implementation for constructors that assumes a polymorphic
     * initialization of objects.
     */
    initialize() {
    }

    /// Asking

    /*
     * Answers true if this O instance is behaving as the given classification, false otherwise.
     * This method would be the equivalent of isKindOf in the classic object oriented paradigm.
     */
    isBehavingAs(aClassification) {
        return MessageDispatcher.objectIsBehavingAs(this, aClassification)
    }

    /*
     * Answers true if the receiver understands the given message, false otherwise.
     * An object responds to a message if any of its classifications does.
     */
    respondsTo(message) {
        return MessageDispatcher.objectRespondsTo(this, message)
    }

    /// Behaviours

    /*
     * Makes this O instance to adquire the behaviour defined in the given classification.
     * If the instance already behaves as the given classification this method does nothing.
     * This behaviour can be dropped from this instance by sending dropBehaviour(classification).
     */
    behaveAs(classification) {
        MessageDispatcher.behaveAs(this, classification)

        return this
    }

    /*
     * Makes this O instance to stop behaving with the behaviour defined in the given classification.
     * An O instance that drops a classification is exactly the same as if it had not previously
     * had that classification and there is no way to distinguish bots scenarios.
     */
    dropBehaviour(classification) {
        MessageDispatcher.objectDropBehaviour(this, classification)

        return this
    }

    /*
     * Evaluates the given closure but starting the method lookup in the previous classification to the one
     * active in the method that called previousClassificationDo().
     */
    previousClassificationDo(closure) {
        return MessageDispatcher.duringPreviousClassificationDo(this, closure)
    }

    /*
     * Instantiates the given classification to this object, evaluates the closure and drops the instantiated
     * classification.
     */
    duringClassificationDo(classification, closure) {
        this.behaveAs(classification)

        try {
            closure()
        } finally {
            this.dropBehaviour(classification)
        }
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
        return MessageDispatcher.objectGetClassifications(this)
    }

    /*
     * Returns the classification active in the method that called thisClassification().
     */
    thisClassification() {
        return MessageDispatcher.objectGetActiveClassification(this)
    }

    /*
     * Returns the previous classification to the active classification in the method that 
     * called previousClassification().
     */
    previousClassification() {
        return MessageDispatcher.objectGetPreviousClassification(this)
    }

    classificationInstanceVariablesDo(classification, closure) {
        MessageDispatcher.classificationInstanceVariablesDo(this, classification, closure)
   
        return this
    }

    /// Evaluating

    /*
     * Evaluates the given closure starting the method lookup on the given classification.
     */
    withClassificationDo(classification, closure) {
        return MessageDispatcher.withClassificationDo(this, classification, closure)
    }

}

module.exports = OInstance