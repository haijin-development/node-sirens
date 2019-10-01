const Classification = require('../../../o-language/classifications/Classification')
const ParseTreeVisitor = require('./ParseTreeVisitor')
const Function = require('../source-code/Function')
const FullParseTreeVisitorProtocol_Implementation = require('../../protocols/FullParseTreeVisitorProtocol_Implementation')

/*
 * A visitor of a javascript parse tree that collects all the function definitions.
 */
class FunctionDefinitionsCollector {
    /// Definition

    static definition() {
        this.instanceVariables = ['collectedFunctionDefinitions']
        this.assumes = [ParseTreeVisitor]
        this.implements = [FullParseTreeVisitorProtocol_Implementation]
    }

    collectFunctionDefinitionsIn({ treeNode: treeNode, sourceFile: sourceFile }) {
        this.collectedFunctionDefinitions = [] 

        this.visit(treeNode)

        return this.collectedFunctionDefinitions.map( (parseNode) => {
                return Function.new({ sourceFile: sourceFile, parseNode: parseNode })
            })
    }

    /// Visiting

    visitMethodDefinition(methodDefinition) {
        return this.collectedFunctionDefinitions.push( methodDefinition )
    }

    visitFunctionDeclaration(functionDeclaration) {
        return this.collectedFunctionDefinitions.push( functionDeclaration )
    }
}

module.exports = Classification.define(FunctionDefinitionsCollector)
