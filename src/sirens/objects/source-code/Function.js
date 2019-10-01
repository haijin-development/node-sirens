const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')

/*
 * The definition of a javascript function.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class Function {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [JsStatement]
        this.classificationBehaviours = [FunctionDefinitionBuilder]
    }

    /// Initializing

    initialize({ sourceFile: sourceFile, parseNode: parseNode }) {
        this.previousClassificationDo( () => {
            this.initialize({
                sourceFile: sourceFile,
                parseNodes: [parseNode]
            })
        })
    }

    /// Queyring

    getFunctionName() {
        const functionNode = this.getFirstNode()

        if( functionNode.type === 'MethodDefinition' ) {
            return functionNode.key.name
        } else {
            return functionNode.id.name
        }
    }
}

class FunctionDefinitionBuilder {

    from({ file: file, line: line, column: column }) {
        const SourceFile = require('../SourceFile')

        const sourceFile = SourceFile.new({ filepath: file })

        return sourceFile.getFunctionAt({ line: line, column: column })
    }

}

FunctionDefinitionBuilder = Classification.define(FunctionDefinitionBuilder)

module.exports = Classification.define(Function)