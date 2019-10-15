const Protocol = require('../../o-language/classifications/Protocol')

/*
 * A visitor of a javascript parse tree that collects all the function definitions.
 */
class FullParseTreeVisitorProtocol_Implementation {
    /// Visiting

    visit(treeNode) {}

    //////////////
    // Expressions
    //////////////

    visitObjectPattern(objectPattern) {}

    visitArrayPattern(arrayPattern) {}

    visitThisExpression(thisExpression) {}

    visitIdentifier(identifier) {}

    visitLiteral(literal) {}

    visitArrayExpression(arrayExpression) {}

    visitObjectExpression(objectExpression) {}

    visitProperty(property) {}

    visitFunctionExpression(functionExpression) {}

    visitArrowFunctionExpression(arrowFunctionExpression) {}

    visitClassExpression(classExpression) {}

    visitTaggedTemplateExpression(taggedTemplateExpression) {}

    visitMemberExpression(memberExpression) {}

    visitSuper(superExpression) {}

    visitMetaProperty(metaProperty) {}

    visitNewExpression(newExpression) {}

    visitCallExpression(callExpression) {}

    visitUpdateExpression(updateExpression) {}

    visitAwaitExpression( awaitExpression ) {}

    visitUnaryExpression(unaryExpression) {}

    visitBinaryExpression(binaryExpression) {}

    visitLogicalExpression(logicalExpression) {}

    visitConditionalExpression(conditionalExpression) {}

    visitYieldExpression(yieldExpression) {}

    visitAssignmentExpression(assignmentExpression) {}

    visitSequenceExpression(sequenceExpression) {}

    visitAssignmentPattern(assignmentPattern) {}

    visitRestElement(restElement) {}

    visitProperty(aProperty) {}

    visitTemplateElement(templateElement) {}

    visitTemplateLiteral(templateLiteral) {}

    visitSpreadElement(spreadElement) {}

    //////////////
    // Statements
    //////////////


    visitBlockStatement(blockStatement) {}

    visitBreakStatement(breakStatement) {}

    visitContinueStatement(continueStatement) {}

    visitDebuggerStatement(debuggerStatement) {}

    visitDoWhileStatement(doWhileStatement) {}

    visitEmptyStatement(emptyStatement) {}

    visitExpressionStatement(expressionStatement) {}

    visitForStatement(forStatement) {}

    visitForInStatement(forInStatement) {}

    visitForOfStatement(forOfStatement) {}

    visitIfStatement(ifStatement) {}

    visitLabeledStatement(labeledStatement) {}

    visitReturnStatement(returnStatement) {}

    visitSwitchStatement(switchStatement) {}

    visitSwitchCase(switchCase) {}

    visitThrowStatement(throwStatement) {}

    visitTryStatement(tryStatement) {}

    visitCatchClause(catchClause) {}

    visitWhileStatement(whileStatement) {}

    visitWithStatement(withStatement) {}

    visitProgram(treeNode) {}

    //////////////
    // Declarations
    //////////////

    visitClassBody(classBody) {}

    visitMethodDefinition(methodDefinition) {}

    visitFunctionDeclaration(functionDeclaration) {}

    visitVariableDeclaration(variableDeclaration) {}

    visitVariableDeclarator(variableDeclarator) {}

    visitClassDeclaration(classDeclaration) {}

    visitImportDeclaration(importDeclaration) {}

    visitImportDefaultSpecifier(importDefaultSpecifier) {}

    visitImportSpecifier(importSpecifier) {}

    visitImportNamespaceSpecifier(importNamespaceSpecifier) {}

    visitExportAllDeclaration(exportAllDeclaration) {}

    visitExportDefaultDeclaration(exportDefaultDeclaration) {}

    visitExportNamedDeclaration(exportNamedDeclaration) {}

    visitExportSpecifier(exportSpecifier) {}

}

module.exports = Protocol.define(FullParseTreeVisitorProtocol_Implementation)
