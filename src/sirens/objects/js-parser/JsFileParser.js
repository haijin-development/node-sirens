const Classification = require('../../../O').Classification
const ParseTreeVisitor = require('./ParseTreeVisitor')
const ParseTreeFlattener = require('./ParseTreeFlattener')

/*
    Class(`
        The library that makes the low-level parsing of javascript (esprima)
        does not generate an expression in the parse tree for comments since
        comments are not statements.

        However it gives the option to collect in a collection all the comments found,
        each comment with its position in the file.

        This object merges the comments collected by esprima to some of the javascript
        expressions in the parse tree (like classes and methods definitions) assigning
        the comment to a property name comment in the expression node:

            expressionNode.comment = comment

        This attachment simplifies and helps working with the documentation of methods
        and classes, usually defined as a comment right before the method or
        class definition.

        The implementation that merges the comments to the expressions is
        inneficient but simple.

        In a first pass it flattens the whole parse tree of expressions to a linear
        array of expressions, each expression with its location in the source code.
        Then it adds all the comments, each comment with its location in the source code.
        Then it performs a sort of the linear array of expressions, sorting by the
        position of the expression or comment in the source code.
        Then it is trivial to find out which one is the comment right before each class
        or method definition.
    `)
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

        const fileContents = sourceFile.readFileContents()

        return this.parseString({ string: fileContents })
    }

    parseString({ string: string }) {
        const parseTree = this.parseStringContents({ string: string })

        if( parseTree !== null ) {
            this.integrateCommentsToExpressions({ parseTree: parseTree })
        }

        if( parseTree === null ) { return null }

        return this.visitTree(parseTree)
    }

    parseStringContents({ string: string }) {
        try {
            return this.getParseTreeFromString({ string: string })
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
            if( exp1.range[0] < exp2.range[0] ) { return -1 }

            if( exp1.range[0] > exp2.range[0] ) { return 1 }

            return 0
        })

        for(let i = 1; i < expressionsWithComments.length; i++ ) {

            const currentExpression = expressionsWithComments[ i ]

            if(
                currentExpression.type === 'ClassDeclaration'
                ||
                currentExpression.type === 'MethodDefinition'
                ||
                currentExpression.type === 'FunctionDeclaration'
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
