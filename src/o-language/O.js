const Sirens = require('../Sirens')

/*
 * This is the only behaviour that is statically bound to an instance and therefore could be considered
 * a Class, according to the classic object oriented paradigm.
 * 
 * In the O language all instances, with no exceptions, are objects of this kind.
 *
 * An O instance by itself contains only the methods to be able to dynamically add and drop behaviours
 * through classifications.
 *
 * In the O language an O instance has nothing else but its identity, all of its behaviour is
 * dynamically added after its instantiation though classifications, and those classifications
 * can be dropped as well.
 */
const O = function() {
    // The ordered collection of the classifications that define the behaviour of this O instance.
    this.classifications = []

    /*
     * Makes this O instance to adquire the behaviour defined in the given classification.
     * If the instance already behaves as the given classification this method does nothing.
     * This behaviour can be dropped from this instance by sending dropBehaviour(classification).
     */
    this.behaveAs = function(classification) {
        if( this.isBehavingAs(classification) ) {
            return this
        }

        this.classifications.unshift(classification)

        buildPrototypeChainOf(this, this.classifications)

        return this
    }

    /*
     * Makes this O instance to stop behaving with the behaviour defined in the given classification.
     * An O instance that drops a classification is exactly the same as if it had not previously
     * had that classification and there is no way to distinguish bots scenarios.
     */
    this.dropBehaviour = function(classification) {
        if( ! this.isBehavingAs(classification) ) {
            return this
        }

        this.classifications = this.classifications.filter( (eachClassification) => {
            return eachClassification !== classification
        })

        buildPrototypeChainOf(this, this.classifications)

        return this
    }

    /*
     * Answers true if this O instance is behaving as the given classification, false otherwise.
     * This method would be the equivalent of isKindOf in the classic object oriented paradigm.
     */
    this.isBehavingAs = function(classification) {
        return this.classifications.includes(classification)
    }
}

// The following methods are defined as functions instead of O class methods to keep
// O instances protocol clean of utility methods.

/*
 * Clones the given classification.
 *
 * The clonning is necessary for the same classification to be part of many different prototypes
 * chains.
 *
 * This is just an implementation artifact to be able to use the javascript prototype chain to
 * perform a method lookip and activation.
 */
function cloneClassification(classification) {
    const classificationCopy = {}

    var originalPrototype = Object.getOwnPropertyNames(classification.prototype);

    for( var funcKey in originalPrototype ) {
        const methodName = originalPrototype[funcKey]
        const method = classification.prototype[methodName]

        classificationCopy[methodName] = method
    }

    return classificationCopy
}

/*
 * Rebuilds the prototype chain of the given object cloning the given classifications.
 */
function buildPrototypeChainOf(object, classifications) {
    let currentObject = object

    classifications.forEach( (eachClassification) => {
        const classificationCopy = cloneClassification(eachClassification)

        classificationCopy.sourceClassification = eachClassification

        Object.setPrototypeOf(currentObject, classificationCopy)

        currentObject = classificationCopy
    })

    /// Make the last classification in the chain to still behave as an O instance
    Object.setPrototypeOf(currentObject, O.prototype)
}

module.exports = O