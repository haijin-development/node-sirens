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
        this.instanceVariables = ['sourceFile', 'collectedFunctionDefinitions']
        this.assumes = [ParseTreeVisitor]
        this.implements = [FullParseTreeVisitorProtocol_Implementation]
    }

    collectFunctionDefinitionsIn({ treeNode: treeNode, sourceFile: sourceFile }) {
        this.sourceFile = sourceFile
        this.collectedFunctionDefinitions = [] 

        this.visit(treeNode)

        return this.collectedFunctionDefinitions
    }

    /// Visiting

    visitMethodDefinition(methodDefinition) {
        const methodName = this.visit( methodDefinition.key )

        let params = this.visit( methodDefinition.value ).params

        params = params.map( (param) => {
            return param.left !== undefined ? param.left : param
        })

        const funct = this.newFunction({
            name: methodName,
            params: params,
            parseNode: methodDefinition,
        })

        return this.collectedFunctionDefinitions
                .push( funct )
    }

    visitFunctionDeclaration(functionDeclaration) {
        const functionName = this.visit( functionDeclaration.id )

        const funct = this.newFunction({
            name: functionName,
            params: [],
            parseNode: functionDeclaration,
        })

        return this.collectedFunctionDefinitions
                .push( funct )
    }

    newFunction({ name: name, params: params, parseNode: parseNode }) {
        return Function.new({
            name: name,
            params: params,
            sourceFile: this.sourceFile,
            parseNode: parseNode
        })
    }

    visitRestElement(restElement) {
        const paramName = this.visit( restElement.argument )

        return '...' + paramName
    }
}

module.exports = Classification.define(FunctionDefinitionsCollector)
