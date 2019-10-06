const Classification = require('../../../o-language/classifications/Classification')

class JsSintaxVisitor {
    /// Definition

    static definition() {
        this.instanceVariables = []
    }

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
            const result = this.visit(element)

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
        this.visit_all( objectPattern.properties )
    }

    visitArrayPattern(arrayPattern) {
        this.visit_all( arrayPattern.elements )
    }

    visitThisExpression(thisExpression) {
        this.visit_leaf( thisExpression )
    }

    visitIdentifier(identifier) {
        identifier.name

        this.visit_leaf( identifier )
    }

    visitLiteral(literal) {
        literal.value
        literal.raw

        if( literal.regex !== undefined ) {
            literal.regex.pattern
        }

        if( literal.regex !== undefined ) {
            literal.regex.flags
        } 

        this.visit_leaf( literal )
    }

    visitArrayExpression(arrayExpression) {
        this.visit_all( arrayExpression.elements )
    }

    visitObjectExpression(objectExpression) {
        this.visit_all( objectExpression.properties )
    }

    visitProperty(property) {
        property.computed
        property.kind
        property.method
        property.shorthand

        this.visit( property.key )

        this.visit( property.value )
    }

    visitFunctionExpression(functionExpression) {
        if( functionExpression.id !== null ) {
            this.visit( functionExpression.id )
        }

        functionExpression.generator
        functionExpression.async
        functionExpression.expression

        this.visit_all( functionExpression.params )

        this.visit(functionExpression.body)
    }

    visitArrowFunctionExpression(arrowFunctionExpression) {
        if( arrowFunctionExpression.id !== null ) {
            this.visit( arrowFunctionExpression.id )
        }

        arrowFunctionExpression.generator
        arrowFunctionExpression.async
        arrowFunctionExpression.expression

        this.visit_all( arrowFunctionExpression.params )

        this.visit(arrowFunctionExpression.body)
    }

    visitClassExpression(classExpression) {
        if( classExpression.id !== null ) {
            this.visit( classExpression.id )
        }

        if( classExpression.superClass !== null ) {
            this.visit( classExpression.superClass )
        }

        this.visit( classExpression.body )
    }

    visitTaggedTemplateExpression(taggedTemplateExpression) {
        this.visit( taggedTemplateExpression.tag )
        this.visit( taggedTemplateExpression.quasi )
    }

    visitMemberExpression(memberExpression) {
        memberExpression.computed

        this.visit( memberExpression.object )
        this.visit( memberExpression.property )
    }

    visitSuper(superExpression) {
    }

    visitMetaProperty(metaProperty) {
        this.visit( metaProperty.meta )
        this.visit( metaProperty.property )
    }

    visitNewExpression(newExpression) {
        this.visit( newExpression.callee )

        this.visit_all( newExpression.arguments )
    }

    visitCallExpression(callExpression) {
        this.visit( callExpression.callee )

        this.visit_all( callExpression.arguments )
    }

    visitUpdateExpression(updateExpression) {
        updateExpression.operator
        updateExpression.prefix

        this.visit( updateExpression.argument )
    }

    visitAwaitExpression( awaitExpression ) {
        this.visit( awaitExpression.argument )
    }

    visitUnaryExpression(unaryExpression) {
        unaryExpression.operator
        unaryExpression.prefix

        this.visit( unaryExpression.argument )
    }

    visitBinaryExpression(binaryExpression) {
        binaryExpression.operator

        this.visit( binaryExpression.left )
        this.visit( binaryExpression.right )
    }

    visitLogicalExpression(logicalExpression) {
        logicalExpression.operator

        this.visit( logicalExpression.left )
        this.visit( logicalExpression.right )
    }

    visitConditionalExpression(conditionalExpression) {
        this.visit( conditionalExpression.test )
        this.visit( conditionalExpression.consequent )
        this.visit( conditionalExpression.alternate )
    }

    visitYieldExpression(yieldExpression) {
        yieldExpression.delegate

        this.visit( yieldExpression.argument )
    }

    visitAssignmentExpression(assignmentExpression) {
        assignmentExpression.operator

        this.visit( assignmentExpression.left )
        this.visit( assignmentExpression.right )
    }

    visitSequenceExpression(sequenceExpression) {
        this.visit_all( sequenceExpression.expressions )
    }

    visitAssignmentPattern(assignmentPattern) {
        this.visit( assignmentPattern.left )
        this.visit( assignmentPattern.right )
    }

    visitRestElement(restElement) {
        this.visit( restElement.argument )
    }

    visitTemplateElement(templateElement) {
        templateElement.value.cooked
        templateElement.value.raw
        templateElement.tail

        this.visit_leaf( templateElement )
    }

    visitTemplateLiteral(templateLiteral) {
        this.visit_all( templateLiteral.quasis )
        this.visit_all( templateLiteral.expressions )
    }

    visitSpreadElement(spreadElement) {
        this.visit( spreadElement.argument )
    }

    //////////////
    // Statements
    //////////////


    visitBlockStatement(blockStatement) {
        this.visit_all( blockStatement.body )
    }

    visitBreakStatement(breakStatement) {
        if( breakStatement.label !== null ) {
            this.visit( breakStatement.label )
        }
    }

    visitContinueStatement(continueStatement) {
        if( continueStatement.label !== null ) {
            this.visit( continueStatement.label )
        }
    }

    visitDebuggerStatement(debuggerStatement) {
        this.visit_leaf( debuggerStatement )
    }

    visitDoWhileStatement(doWhileStatement) {
        this.visit( doWhileStatement.body )
        this.visit( doWhileStatement.test )
    }

    visitEmptyStatement(emptyStatement) {
        this.visit_leaf( emptyStatement )
    }

    visitExpressionStatement(expressionStatement) {
        expressionStatement.directive

        return this.visit( expressionStatement.expression )
    }

    visitForStatement(forStatement) {
        this.visit( forStatement.init )
        this.visit( forStatement.test )
        this.visit( forStatement.update )

        this.visit( forStatement.body )
    }

    visitForInStatement(forInStatement) {
        this.visit( forInStatement.left )
        this.visit( forInStatement.right )

        this.visit( forInStatement.body )

        forInStatement.each
    }

    visitForOfStatement(forOfStatement) {
        this.visit( forOfStatement.left )
        this.visit( forOfStatement.right )

        this.visit( forOfStatement.body )
    }

    visitIfStatement(ifStatement) {
        this.visit( ifStatement.test )
        this.visit( ifStatement.consequent )

        if( ifStatement.alternate !== null ) {
            this.visit( ifStatement.alternate )
        }
    }

    visitLabeledStatement(labeledStatement) {
        this.visit( labeledStatement.label )
        this.visit( labeledStatement.body )
    }

    visitReturnStatement(returnStatement) {
        if( returnStatement.argument !== null ) {
            this.visit( returnStatement.argument )
        }
    }

    visitSwitchStatement(switchStatement) {
        this.visit( switchStatement.discriminant )
        this.visit_all( switchStatement.cases )
    }

    visitSwitchCase(switchCase) {
        this.visit( switchCase.test )
        this.visit_all( switchCase.consequent )
    }

    visitThrowStatement(throwStatement) {
        this.visit( throwStatement.argument )
    }

    visitTryStatement(tryStatement) {
        this.visit( tryStatement.block )

        if( tryStatement.handler !== null ) {
            this.visit( tryStatement.handler )
        }

        if( tryStatement.finalizer !== null ) {
            this.visit( tryStatement.finalizer )
        }
    }

    visitCatchClause(catchClause) {
        this.visit( catchClause.param )
        this.visit( catchClause.body )
    }

    visitWhileStatement(whileStatement) {
        this.visit( whileStatement.test )
        this.visit( whileStatement.body )
    }

    visitWithStatement(withStatement) {
        this.visit( withStatement.object )
        this.visit( withStatement.body )
    }

    visitProgram(treeNode) {
        return this.visit_all( treeNode.body )
    }

    //////////////
    // Declarations
    //////////////

    visitClassBody(classBody) {
        this.visit_all( classBody.body )
    }

    visitMethodDefinition(methodDefinition) {
        methodDefinition.computed
        methodDefinition.kind
        methodDefinition.static

        this.visit( methodDefinition.key )
        this.visit( methodDefinition.value )
    }

    visitFunctionDeclaration(functionDeclaration) {
        if( functionDeclaration.id !== null ) {
            this.visit( functionDeclaration.id )
        }

        functionDeclaration.generator
        functionDeclaration.async
        functionDeclaration.expression

        this.visit_all( functionDeclaration.params )

        this.visit(functionDeclaration.body)
    }

    visitVariableDeclaration(variableDeclaration) {
        variableDeclaration.kind

        this.visit_all( variableDeclaration.declarations )
    }

    visitVariableDeclarator(variableDeclarator) {
        this.visit( variableDeclarator.id )

        if( variableDeclarator.init != null ) {
            this.visit( variableDeclarator.init )
        }
    }

    visitClassDeclaration(classDeclaration) {
        if( classDeclaration.id !== null ) {
            this.visit( classDeclaration.id )
        }

        if( classDeclaration.superClass !== null ) {
            this.visit( classDeclaration.superClass )
        }

        this.visit( classDeclaration.body )
    }

    visitImportDeclaration(importDeclaration) {
        this.visit_all( importDeclaration.specifiers )
        this.visit( importDeclaration.source )
    }

    visitImportDefaultSpecifier(importDefaultSpecifier) {
        importDefaultSpecifier.imported

        this.visit( importDefaultSpecifier.local )
    }

    visitImportSpecifier(importSpecifier) {
        importSpecifier.imported

        this.visit( importSpecifier.local )
    }

    visitImportNamespaceSpecifier(importNamespaceSpecifier) {
        importNamespaceSpecifier.imported

        this.visit( importNamespaceSpecifier.local )
    }

    visitExportAllDeclaration(exportAllDeclaration) {
        this.visit( exportAllDeclaration.source )
    }

    visitExportDefaultDeclaration(exportDefaultDeclaration) {
        this.visit( exportDefaultDeclaration.declaration )
    }

    visitExportNamedDeclaration(exportNamedDeclaration) {
        this.visit( exportNamedDeclaration.declaration )
        this.visit_all( exportNamedDeclaration.specifiers )
        this.visit( exportNamedDeclaration.source )
    }

    visitExportSpecifier(exportSpecifier) {
        this.visit( exportSpecifier.exported )
        this.visit( exportSpecifier.local )
    }

}

module.exports = Classification.define(JsSintaxVisitor)
