const Sirens = require('../Sirens')
const MessageDispatcher = require('./implementation/MessageDispatcher')

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
class OInstance {

    /*
     * Returns a new O instance with this OInstance classification instantiated in it.
     */
    static new() {
        return MessageDispatcher.createObject()
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

    /// Evaluating

    withClassificationDo(classification, closure) {
        MessageDispatcher.duringClassificationDo(classification, closure)
    }

}

module.exports = OInstance