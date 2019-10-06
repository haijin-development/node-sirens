const Classification = require('../../../o-language/classifications/Classification')

/*
 * A visitor of a javascript parse tree.
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

    visit_all(elements) {
        const results = []

        elements.forEach( (element) => {
            const result = this.visit( element )

            results.push( result )
        })

        return results;
    }

    visit_leaf(leaf_element) {
    }

    //////////////
    // Expressions
    //////////////

    visitObjectPattern(objectPattern) {
        return this.visit_all( objectPattern.properties )
    }

    visitArrayPattern(arrayPattern) {
        return this.visit_all( arrayPattern.elements )
    }

    visitThisExpression(thisExpression) {
        return 'this'
    }

    visitIdentifier(identifier) {
        return identifier.name
    }

    visitLiteral(literal) {
        return literal.value
    }

    visitArrayExpression(arrayExpression) {
        return this.visit_all( arrayExpression.elements )
    }

    visitObjectExpression(objectExpression) {
        return this.visit_all( objectExpression.properties )
    }

    visitProperty(property) {
        const result = {}

        result.key = this.visit( property.key )

        result.value = this.visit( property.value )

        return result
    }

    visitFunctionExpression(functionExpression) {
        const result = {}

        if( functionExpression.id !== null ) {
            result.id = this.visit( functionExpression.id )
        }

        result.params = this.visit_all( functionExpression.params )

        result.body = this.visit(functionExpression.body)

        return result
    }

    visitArrowFunctionExpression(arrowFunctionExpression) {
        const result = {}

        if( arrowFunctionExpression.id !== null ) {
            result.id = this.visit( arrowFunctionExpression.id )
        }

        result.params = this.visit_all( arrowFunctionExpression.params )

        result.body = this.visit( arrowFunctionExpression.body )

        return result
    }

    visitClassExpression(classExpression) {
        const result = {}

        if( classExpression.id !== null ) {
            result.id = this.visit( classExpression.id )
        }

        if( classExpression.superClass !== null ) {
            result.superClass = this.visit( classExpression.superClass )
        }

        result.body = this.visit( classExpression.body )

        return result
    }

    visitTaggedTemplateExpression(taggedTemplateExpression) {
        const result = {}

        result.tag = this.visit( taggedTemplateExpression.tag )
        result.quasi = this.visit( taggedTemplateExpression.quasi )

        return result
    }

    visitMemberExpression(memberExpression) {
        const result = {}

        result.object = this.visit( memberExpression.object )
        result.property = this.visit( memberExpression.property )

        return result
    }

    visitSuper(superExpression) {
    }

    visitMetaProperty(metaProperty) {
        const result = {}

        result.meta = this.visit( metaProperty.meta )
        result.property = this.visit( metaProperty.property )

        return result
    }

    visitNewExpression(newExpression) {
        const result = {}

        result.callee = this.visit( newExpression.callee )

        result.arguments = this.visit_all( newExpression.arguments )

        return result
    }

    visitCallExpression(callExpression) {
        const result = {}

        result.callee = this.visit( callExpression.callee )

        result.arguments = this.visit_all( callExpression.arguments )

        return result
    }

    visitUpdateExpression(updateExpression) {
        return this.visit( updateExpression.argument )
    }

    visitAwaitExpression( awaitExpression ) {
        return this.visit( awaitExpression.argument )
    }

    visitUnaryExpression(unaryExpression) {
        return this.visit( unaryExpression.argument )
    }

    visitBinaryExpression(binaryExpression) {
        const result = {}

        result.left = this.visit( binaryExpression.left )
        result.right = this.visit( binaryExpression.right )

        return result
    }

    visitLogicalExpression(logicalExpression) {
        const result = {}

        result.left = this.visit( logicalExpression.left )
        result.right = this.visit( logicalExpression.right )

        return result
    }

    visitConditionalExpression(conditionalExpression) {
        const result = {}

        result.test = this.visit( conditionalExpression.test )
        result.consequent = this.visit( conditionalExpression.consequent )
        result.alternate = this.visit( conditionalExpression.alternate )

        return result
    }

    visitYieldExpression(yieldExpression) {
        return this.visit( yieldExpression.argument )
    }

    visitAssignmentExpression(assignmentExpression) {
        const result = {}

        result.left = this.visit( assignmentExpression.left )
        result.right = this.visit( assignmentExpression.right )

        return result
    }

    visitSequenceExpression(sequenceExpression) {
        return this.visit_all( sequenceExpression.expressions )
    }

    visitAssignmentPattern(assignmentPattern) {
        const result = {}

        result.left = this.visit( assignmentPattern.left )
        result.right = this.visit( assignmentPattern.right )

        return result
    }

    visitRestElement(restElement) {
        return this.visit( restElement.argument )
    }

    visitTemplateElement(templateElement) {
        return templateElement.value
    }

    visitTemplateLiteral(templateLiteral) {
        const result = {}

        result.quasis = this.visit_all( templateLiteral.quasis )
        result.expressions = this.visit_all( templateLiteral.expressions )

        return result
    }

    //////////////
    // Statements
    //////////////


    visitBlockStatement(blockStatement) {
        return this.visit_all( blockStatement.body )
    }

    visitBreakStatement(breakStatement) {
        if( breakStatement.label !== null ) {
            return this.visit( breakStatement.label )
        }
    }

    visitContinueStatement(continueStatement) {
        if( continueStatement.label !== null ) {
            return this.visit( continueStatement.label )
        }
    }

    visitDebuggerStatement(debuggerStatement) {
        return 'debugger'
    }

    visitDoWhileStatement(doWhileStatement) {
        const result = {}

        result.body = this.visit( doWhileStatement.body )
        result.test = this.visit( doWhileStatement.test )

        return result
    }

    visitEmptyStatement(emptyStatement) {
        return undefined
    }

    visitExpressionStatement(expressionStatement) {
        return this.visit( expressionStatement.expression )
    }

    visitForStatement(forStatement) {
        const result = {}

        result.init = this.visit( forStatement.init )
        result.test = this.visit( forStatement.test )
        result.update = this.visit( forStatement.update )

        result.body = this.visit( forStatement.body )

        return result
    }

    visitForInStatement(forInStatement) {
        const result = {}

        result.left = this.visit( forInStatement.left )
        result.right = this.visit( forInStatement.right )

        result.body = this.visit( forInStatement.body )

        return result
    }

    visitForOfStatement(forOfStatement) {
        const result = {}

        result.left = this.visit( forOfStatement.left )
        result.right = this.visit( forOfStatement.right )

        result.body = this.visit( forOfStatement.body )

        return result
    }

    visitIfStatement(ifStatement) {
        const result = {}

        result.test = this.visit( ifStatement.test )
        result.consequent = this.visit( ifStatement.consequent )

        if( ifStatement.alternate !== null ) {
            result.alternate = this.visit( ifStatement.alternate )
        }

        return result
    }

    visitLabeledStatement(labeledStatement) {
        const result = {}

        result.label = this.visit( labeledStatement.label )
        result.body = this.visit( labeledStatement.body )

        return result
    }

    visitReturnStatement(returnStatement) {
        if( returnStatement.argument !== null ) {
            return this.visit( returnStatement.argument )
        }
    }

    visitSwitchStatement(switchStatement) {
        const result = {}

        result.discriminant = this.visit( switchStatement.discriminant )
        result.cases = this.visit_all( switchStatement.cases )

        return result
    }

    visitSwitchCase(switchCase) {
        const result = {}

        result.test = this.visit( switchCase.test )
        result.consequent = this.visit_all( switchCase.consequent )

        return result
    }

    visitThrowStatement(throwStatement) {
        return this.visit( throwStatement.argument )
    }

    visitTryStatement(tryStatement) {
        const result = {}

        result.block = this.visit( tryStatement.block )

        if( tryStatement.handler !== null ) {
            result.handler = this.visit( tryStatement.handler )
        }

        if( tryStatement.finalizer !== null ) {
            result.finalizer = this.visit( tryStatement.finalizer )
        }

        return result
    }

    visitCatchClause(catchClause) {
        const result = {}

        result.param = this.visit( catchClause.param )
        result.body = this.visit( catchClause.body )

        return result
    }

    visitWhileStatement(whileStatement) {
        const result = {}

        result.test = this.visit( whileStatement.test )
        result.body = this.visit( whileStatement.body )

        return result
    }

    visitWithStatement(withStatement) {
        const result = {}

        result.object = this.visit( withStatement.object )
        result.body = this.visit( withStatement.body )

        return result
    }

    visitProgram(treeNode) {
        return this.visit_all( treeNode.body )
    }

    visitSpreadElement(spreadElement) {
        return this.visit( spreadElement.argument )
    }

    //////////////
    // Declarations
    //////////////

    visitClassBody(classBody) {
        return this.visit_all( classBody.body )
    }

    visitMethodDefinition(methodDefinition) {
        const result = {}

        result.key = this.visit( methodDefinition.key )
        result.value = this.visit( methodDefinition.value )

        return result
    }

    visitFunctionDeclaration(functionDeclaration) {
        const result = {}

        if( functionDeclaration.id !== null ) {
            result.id = this.visit( functionDeclaration.id )
        }

        result.params = this.visit_all( functionDeclaration.params )

        result.body = this.visit(functionDeclaration.body)

        return result
    }

    visitVariableDeclaration(variableDeclaration) {
        return this.visit_all( variableDeclaration.declarations )
    }

    visitVariableDeclarator(variableDeclarator) {
        const result = {}

        result.id = this.visit( variableDeclarator.id )

        if( variableDeclarator.init != null ) {
            result.init = this.visit( variableDeclarator.init )
        }

        return result
    }

    visitClassDeclaration(classDeclaration) {
        const result = {}

        if( classDeclaration.id !== null ) {
            result.id = this.visit( classDeclaration.id )
        }

        if( classDeclaration.superClass !== null ) {
            result.superClass = this.visit( classDeclaration.superClass )
        }

        result.body = this.visit( classDeclaration.body )

        return result
    }

    visitImportDeclaration(importDeclaration) {
        const result = {}

        result.specifiers = this.visit_all( importDeclaration.specifiers )
        result.source = this.visit( importDeclaration.source )

        return result
    }

    visitImportDefaultSpecifier(importDefaultSpecifier) {
        return this.visit( importDefaultSpecifier.local )
    }

    visitImportSpecifier(importSpecifier) {
        return this.visit( importSpecifier.local )
    }

    visitImportNamespaceSpecifier(importNamespaceSpecifier) {
        return this.visit( importNamespaceSpecifier.local )
    }

    visitExportAllDeclaration(exportAllDeclaration) {
        return this.visit( exportAllDeclaration.source )
    }

    visitExportDefaultDeclaration(exportDefaultDeclaration) {
        return this.visit( exportDefaultDeclaration.declaration )
    }

    visitExportNamedDeclaration(exportNamedDeclaration) {
        const result = {}

        result.declaration = this.visit( exportNamedDeclaration.declaration )
        result.specifiers = this.visit_all( exportNamedDeclaration.specifiers )
        result.source = this.visit( exportNamedDeclaration.source )

        return result
    }

    visitExportSpecifier(exportSpecifier) {
        const result = {}

        result.exported = this.visit( exportSpecifier.exported )
        result.local = this.visit( exportSpecifier.local )

        return result
    }
}

module.exports = Classification.define(ParseTreeVisitor)
