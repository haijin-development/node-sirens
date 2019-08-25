const Classification = require('../../o-language/classifications/Classification')

/*
 * The definition of a javascript class.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
const ClassDefinition = Classification.define( class {
    /// Definition

    static definition() {
        this.instanceVariables = ['parseNode']
    }

    /// Initializing

    initialize(parseNode) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.parseNode = parseNode
    }

    /// Accessing

    getClassName() {
        return this.parseNode.id.name
    }
})

module.exports = ClassDefinition