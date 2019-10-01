const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')

/*
 * The statements previous to a ClassDefinition.
 *
 * This section tipically includes the global requires, the global constants definintions, etc.
 */
class ClassHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [JsStatement]
    }

    /// Initializing

    initialize({ sourceFile: sourceFile, parseNodes: parseNodes }) {
        this.previousClassificationDo( () => {
            this.initialize({
                sourceFile: sourceFile,
                parseNodes: parseNodes
            })
        })
    }
}

module.exports = Classification.define(ClassHeader)
