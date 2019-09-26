const Classification = require('../../../o-language/classifications/Classification')
const Sirens = require('../../../Sirens')

/*
 * A visitor of a javascript parse tree that collects all the function definitions.
 */
class ParseTreeVisitor {
    /// Definition

    static definition() {
        this.instanceVariables = []
    }

    /// Visiting

    /*
     * Dynamically call a function named 'visit[treeNode.type]'.
     * In the future generate the source code for each 'visit[...]' function call to make sure
     * that the implemented 'visit[...]'' functions are always in sync with the existing node types from
     *      https://esprima.readthedocs.io/en/latest/syntax-tree-format.html
     */
    visit(treeNode) {
        const treeNodeType = treeNode.type

        const treeNodeHandler = 'visit' + treeNodeType

        const methodHandler = this[treeNodeHandler]

        if( methodHandler === undefined ) {
            throw new Error(`Uknown treeNode type '${treeNodeType}'`)
        }

        return methodHandler.call(this, treeNode)
    }

    visitProgram(treeNode) {
        return undefined
    }

    visitClassDeclaration(treeNode) {
        return undefined
    }

    visitFunctionDeclaration(treeNode) {
        return undefined
    }

    visitExpressionStatement(treeNode) {
        return undefined
    }

    visitMethodDefinition(treeNode) {
        return undefined
    }

    visitAssignmentExpression(treeNode) {
        return undefined
    }

    visitMemberExpression(treeNode) {
        return undefined
    }

    visitIdentifier(treeNode) {
        return undefined
    }

    visitVariableDeclaration(treeNode) {
        return undefined
    }

    visitVariableDeclarator(treeNode) {
        return undefined
    }

    visitCallExpression(treeNode) {
        return undefined 
    }
}

module.exports = Classification.define(ParseTreeVisitor)
