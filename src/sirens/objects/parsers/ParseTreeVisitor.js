const Sirens = require('../../../Sirens')

/*
 * A visitor of a javascript parse tree that collects all the function definitions.
 */
class ParseTreeVisitor {

    /// Visiting

    visit(treeNode) {
        const treeNodeType = treeNode.type

        switch(treeNodeType) {
            case 'Program':
                return this.visitProgram(treeNode)
                break

            case 'ClassDeclaration':
                return this.visitClassDeclaration(treeNode)
                break

            case 'FunctionDeclaration':
                return this.visitFunctionDeclaration(treeNode)
                break

            case 'ExpressionStatement':
                return this.visitExpressionStatement(treeNode)
                break

            case 'MethodDefinition':
                return this.visitMethodDefinition(treeNode)
                break

            case 'AssignmentExpression':
                return this.visitAssignmentExpression(treeNode)
                break

            case 'MemberExpression':
                return this.visitMemberExpression(treeNode)
                break

            case 'Identifier':
                return this.visitIdentifier(treeNode)
                break

            case 'VariableDeclaration':
                return this.visitVariableDeclaration(treeNode)
                break

            case 'VariableDeclarator':
                return this.visitVariableDeclarator(treeNode)
                break

            case 'CallExpression':
                return this.visitCallExpression(treeNode)
                break

            default:
                throw new Error(`Uknown treeNode type" '${treeNodeType}'`)
        }
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

module.exports = ParseTreeVisitor