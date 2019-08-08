const Sirens = require('../../Sirens')

/*
 * The definition of a javascript function.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class FunctionDefinition {
    /// Initializing

    constructor(parseNode) {
        this.parseNode = parseNode
    }

    /// Accessing

    getFunctionName() {
        if( this.parseNode.type === 'MethodDefinition' ) {
            return this.parseNode.key.name
        } else {
            return this.parseNode.id.name
        }
    }

    getStartingPosition() {
        return this.parseNode.loc.start
    }

    getEndingPosition() {
        return this.parseNode.loc.end
    }
}

module.exports = FunctionDefinition