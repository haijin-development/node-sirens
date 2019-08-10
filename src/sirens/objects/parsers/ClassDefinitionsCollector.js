const ParseTreeVisitor = require('./ParseTreeVisitor')
const ClassDefinition = require('../ClassDefinition')

/*
 * A visitor of a javascript parse tree that collects all the function definitions.
 */
class ClassDefinitionsCollector extends ParseTreeVisitor {

    collectClassDefinitionsIn(treeNode) {
        const classDeclarations = this.visit(treeNode)

        return classDeclarations.map( (parseNode) => {
                return new ClassDefinition(parseNode)
            })
    }

    /// Visiting

    visitProgram(treeNode) {
        let classDefinitions = []

        const childNodes = treeNode.body

        childNodes.forEach( (node) => {
            classDefinitions = classDefinitions.concat( this.visit(node) )
        })

        return classDefinitions
    }

    visitClassDeclaration(treeNode) {
        return [treeNode]
    }

    visitFunctionDeclaration(treeNode) {
        return []
    }

    visitExpressionStatement(treeNode) {
        return []
    }
}

module.exports = ClassDefinitionsCollector