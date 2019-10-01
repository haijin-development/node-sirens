const Classification = require('../../../o-language/classifications/Classification')
const ParseTreeVisitor = require('./ParseTreeVisitor')
const ClassDefinition = require('../source-code/ClassDefinition')
const FullParseTreeVisitorProtocol_Implementation = require('../../protocols/FullParseTreeVisitorProtocol_Implementation')

/*
 * A visitor of a javascript parse tree that collects all the function definitions.
 */
class ClassDefinitionsCollector {

    static definition() {
        this.instanceVariables = ['collectedClassDefinitions']
        this.assumes = [ParseTreeVisitor]
        this.implements = [FullParseTreeVisitorProtocol_Implementation]
    }

    collectClassDefinitionsIn({ treeNode: treeNode, sourceFile: sourceFile }) {
        if( treeNode === null ) {
            return []
        }

        this.collectedClassDefinitions = [] 

        this.visit(treeNode)

        return this.collectedClassDefinitions.map( (parseNode) => {
                return ClassDefinition.new({
                    sourceFile: sourceFile,
                    parseNode: parseNode,
                })
            })
    }

    /// Visiting

    visitClassDeclaration(classDeclaration) {
        this.collectedClassDefinitions.push( classDeclaration )
    }

    visitClassExpression(classExpression) {
        this.collectedClassDefinitions.push( classExpression )
    }
}

module.exports = Classification.define(ClassDefinitionsCollector)
