
/*
 * The definition of a javascript class.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class ClassDefinition {
    /// Initializing

    constructor(parseNode) {
        this.parseNode = parseNode
    }

    /// Accessing

    getClassName() {
        return this.parseNode.id.name
    }
}

module.exports = ClassDefinition