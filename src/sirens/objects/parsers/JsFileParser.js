const Classification = require('../../../O').Classification
const ParseTreeVisitor = require('./ParseTreeVisitor')
const ParseTreeFlattener = require('./ParseTreeFlattener')

/*
 * A visitor of a javascript parse tree.
 */
class JsFileParser {
    /// Definition

    static definition() {
        this.instanceVariables = ['sourceFile']
        this.assumes = [ParseTreeVisitor]
    }

    getSourceFile() {
        return this.sourceFile
    }

    /// Parsing

    parse({ sourceFile: sourceFile }) {
        this.sourceFile = sourceFile

        const parseTree = this.parseFileContents()

        if( parseTree !== null ) {
            this.integrateCommentsToExpressions({ parseTree: parseTree })
        }

        if( parseTree === null ) { return null }

        return this.visitTree(parseTree)
    }

    parseFileContents() {
        const fileContents = this.sourceFile.getFileContents()

        try {
            return this.parseString({ string: fileContents })
        } catch(error) {
            return null
        }
    }

    integrateCommentsToExpressions({ parseTree: parseTree }) {
        const expressionsFlattener = ParseTreeFlattener.new()

        const expressions = expressionsFlattener.flattenExpressionsIn({
            treeNode: parseTree
        })

        const expressionsWithComments = expressions.concat( parseTree.comments )

        expressionsWithComments.sort( (exp1, exp2) => {
            if( exp1.loc.start.line < exp2.loc.start.line ) { return -1 }

            if( exp1.loc.start.line > exp2.loc.start.line ) { return 1 }

            if( exp1.loc.start.line === exp2.loc.start.line ) {
                if( exp1.loc.start.column === exp2.loc.start.column ) {
                    return 0
                }
                
                if( exp1.loc.start.column < exp2.loc.start.column ) { return -1 }
                if( exp1.loc.start.column > exp2.loc.start.column ) { return 1 }
            }
        });

        for(let i = 1; i < expressionsWithComments.length; i++ ) {

            const currentExpression = expressionsWithComments[ i ]

            if(
                currentExpression.type === 'ClassDeclaration'
                ||
                currentExpression.type === 'MethodDefinition'
              )
              {
                const previousExpression = expressionsWithComments[ i - 1 ]
                const previousPreviousExpression = expressionsWithComments[ i - 2 ]

                if( previousExpression.type === 'Block' ) {
                    currentExpression.comment = previousExpression
                }

                // Sometimes esprima generates an additional Indentifier node before the Declaration:
                //      Identifier {
                //          type: 'Identifier',
                //          name: 'constructor',
                if(
                    previousPreviousExpression && previousPreviousExpression.type === 'Block'
                    &&
                    previousExpression.type === 'Identifier'
                  ) {
                    currentExpression.comment = previousPreviousExpression
                }
            }
        }
    }
}

module.exports = Classification.define(JsFileParser)
