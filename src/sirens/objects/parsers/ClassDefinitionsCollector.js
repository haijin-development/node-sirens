const Classification = require('../../../o-language/classifications/Classification')
const ParseTreeVisitor = require('./ParseTreeVisitor')
const ClassDefinition = require('../js-statements/ClassDefinition')

/*
 * A visitor of a javascript parse tree that collects all the function definitions.
 */
class ClassDefinitionsCollector {

    static definition() {
        this.instanceVariables = []
        this.assumes = [ParseTreeVisitor]
    }

    collectClassDefinitionsIn({ treeNode: treeNode, sourceFile: sourceFile }) {
        if( treeNode === null ) {
            return []
        }

        const classDeclarations = this.visit(treeNode)

        return classDeclarations.map( (parseNode) => {
                return ClassDefinition.new({ parseNode: parseNode, sourceFile: sourceFile })
            })
    }

    /// Visiting

    visitProgram(treeNode) {
        let collectedClassDefinitions = []

        const childNodes = treeNode.body

        childNodes.forEach( (node) => {
            const classDefinition = this.visit(node)

            if( classDefinition !== undefined ) {
                collectedClassDefinitions.push( classDefinition )
            }
        })

        return collectedClassDefinitions
    }

    visitClassDeclaration(treeNode) {
        return treeNode
    }
}

module.exports = Classification.define(ClassDefinitionsCollector)
