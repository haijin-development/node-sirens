const Classification = require('../../../O').Classification
const ParseTreeVisitor = require('./ParseTreeVisitor')
const FunctionDeclaration = require('../source-code/FunctionDeclaration')
const FunctionDefinition = require('../source-code/FunctionDefinition')
const FullParseTreeVisitorProtocol_Implementation = require('../../protocols/FullParseTreeVisitorProtocol_Implementation')
const AbsentComment = require('../source-code/AbsentComment')

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

        const funct = this.newFunctionDefinition({
            name: methodName,
            params: params,
            parseNode: methodDefinition,
        })

        return this.collectedFunctionDefinitions
                .push( funct )
    }

    visitFunctionDeclaration(functionDeclaration) {
        const functionName = this.visit( functionDeclaration.id )

        const funct = this.newFunctionDefinition({
            name: functionName,
            params: [],
            parseNode: functionDeclaration,
        })

        return this.collectedFunctionDefinitions
                .push( funct )
    }

    newFunctionDefinition({ name: name, params: params, parseNode: parseNode }) {
        const functionDeclaration = FunctionDeclaration.new({
            name: name,
            params: params,
            sourceFile: this.sourceFile,
            parseNode: parseNode,
        })


        const comment = this.getCommentOn({
            parseNode: parseNode,
            functionDeclaration: functionDeclaration,
        })

        return FunctionDefinition.new({
            comment: comment,
            declaration: functionDeclaration,
        })
    }

    visitRestElement(restElement) {
        const paramName = this.visit( restElement.argument )

        return '...' + paramName
    }

    getCommentOn({ parseNode: parseNode, functionDeclaration: functionDeclaration }) {
        const Comment = require('../source-code/Comment')

        if( parseNode.comment === undefined ) {
            return this.buildMissingComment({
                parseNode: parseNode,
                functionDeclaration: functionDeclaration,
            })
        }

        return Comment.new({
            sourceFile: this.sourceFile,
            parseNode: parseNode.comment,
        })
    }

    buildMissingComment({ parseNode: parseNode, functionDeclaration: functionDeclaration }) {
        const { indentationChar, indentationCount } = functionDeclaration.detectIdentation()

        return AbsentComment.new({
            sourceFile: this.sourceFile,
            lineNumber: parseNode.loc.start.line,
            columnNumber: parseNode.loc.start.column,
            indentationCount: indentationCount,
            indentationChar: indentationChar,
        })
    }
}

module.exports = Classification.define(FunctionDefinitionsCollector)
