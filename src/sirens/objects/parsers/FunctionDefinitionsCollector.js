const ParseTreeVisitor = require('./ParseTreeVisitor')
const FunctionDefinition = require('../FunctionDefinition')
const Sirens = require('../../../Sirens')

/*
 * A visitor of a javascript parse tree that collects all the function definitions.
 */
class FunctionDefinitionsCollector extends ParseTreeVisitor {

    collectFunctionDefinitionsIn({treeNode: treeNode, sourceFile: sourceFile}) {
        const functionDeclarations = this.visit(treeNode)

        return functionDeclarations.map( (parseNode) => {
                return new FunctionDefinition({parseNode: parseNode, sourceFile: sourceFile})
            })
    }

    /// Visiting

    defaultVisitResult() {
        return []
    }

    visit(treeNode) {
        const result = super.visit(treeNode)

        if( result !== undefined ) {
            return result
        }

        return this.defaultVisitResult()
    }


    visitProgram(treeNode) {
        const childNodes = treeNode.body

        return childNodes.reduce(
            (functionDefinitions, node) => {
                return functionDefinitions.concat( this.visit(node) )
            },
            []
        )
    }

    visitClassDeclaration(treeNode) {
        const childNodes = treeNode.body.body

        return childNodes.reduce(
            (functionDefinitions, node) => {
                return functionDefinitions.concat( this.visit(node) )
            },
            []
        )
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

    visitVariableDeclaration(treeNode) {
        const childNodes = treeNode.declarations

        return childNodes.reduce(
            (functionDefinitions, node) => {
                return functionDefinitions.concat( this.visit(node) )
            },
            []
        )
    }
}

module.exports = FunctionDefinitionsCollector