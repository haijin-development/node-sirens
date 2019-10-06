const Classification = require('../../../o-language/classifications/Classification')
const ParseTreeVisitor = require('./ParseTreeVisitor')
const FullParseTreeVisitorProtocol_Implementation = require('../../protocols/FullParseTreeVisitorProtocol_Implementation')

class ParseTreeFlattener {

    static definition() {
        this.instanceVariables = ['flattenedExpressions']
        this.assumes = [ParseTreeVisitor]
        this.implements = [FullParseTreeVisitorProtocol_Implementation]
    }

    flattenExpressionsIn({ treeNode: treeNode }) {
        this.flattenedExpressions = [] 

        this.visit( treeNode )

        return this.flattenedExpressions
    }

    /// Visiting

    visit(treeNode) {
        this.flattenedExpressions.push(treeNode)

        this.previousClassificationDo( () => {
            this.visit(treeNode)
        })
    }
}

module.exports = Classification.define(ParseTreeFlattener)
