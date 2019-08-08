const ParseTreeVisitor = require('./ParseTreeVisitor')
const FunctionDefinition = require('../FunctionDefinition')
const Sirens = require('../../../Sirens')

/*
 * A visitor of a javascript parse tree that collects all the function definitions.
 */
class FunctionDefinitionsCollector extends ParseTreeVisitor {

    collectFunctionDefinitionsIn(treeNode) {
        const functionDeclarations = this.visit(treeNode)

        return functionDeclarations.map( (parseNode) => {
                return new FunctionDefinition(parseNode)
            })
    }

    /// Visiting

    visitProgram(treeNode) {
        let functionDefinitions = []

        const childNodes = treeNode.body

        childNodes.forEach( (node) => {
            functionDefinitions = functionDefinitions.concat( this.visit(node) )
        })

        return functionDefinitions
    }

    visitClassDeclaration(treeNode) {
        let functionDefinitions = []

        const childNodes = treeNode.body.body

        childNodes.forEach( (node) => {
            functionDefinitions = functionDefinitions.concat( this.visit(node) )
        })

        return functionDefinitions
    }

    visitMethodDefinition(treeNode) {
        return [treeNode]
    }

    visitFunctionDeclaration(treeNode) {
        return [treeNode]
    }

    visitExpressionStatement(treeNode) {
        return this.visit(treeNode.expression)
    }

    visitAssignmentExpression(treeNode) {
        let functionDefinitions = []

        functionDefinitions = functionDefinitions.concat( this.visit(treeNode.left) )
        functionDefinitions = functionDefinitions.concat( this.visit(treeNode.right) )

        return functionDefinitions
    }

    visitMemberExpression(treeNode) {
        return []
    }

    visitIdentifier(treeNode) {
        return []
    }
}

module.exports = FunctionDefinitionsCollector