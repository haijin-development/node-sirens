const Classification = require('../../../O').Classification
const ObjectWithNamespace = require('../../../O').ObjectWithNamespace
const JsFileParser = require('./JsFileParser')

/*
    Class(`
        This object defines a DSL to parse javascript files and build a model of objects
        from the parsed contents.

        It improves the use of ParseTreeVisitor for writing parsers in a more
        expressive language, even thou its implementation does use the ParseTreeVisitor.

        The difference with a plain ParseTreeVisitor is explained below.

        To visit a parsed node in the expressions tree a ParseTreeVisitor defines a
        method for each possible expression type, for example:

            visitFunctionExpression(functionExpressionNode) {
                const result = {}

                if( functionExpression.id !== null ) {
                    result.id = this.visit( functionExpression.id )
                }

                result.params = this.visit_all( functionExpression.params )

                result.body = this.visit(functionExpression.body)

                return result
            }

        From the received expressionNode it chooses wich sub-expressions to visit,
        calls .visit() on the sub-expressions and uses the result of the visited
        sub-expressions.

        A JsParserDsl is similar but:

            - a node visitor definition uses the name of the visited Node instead
            of prepending 'visit' to the method. The difference is almost cosmetic
            but it does improve the expressiveness of the parser definition.

            - a node visitor definition does not need to call visit on the sub-expressions,
            the JsParserDsl already called it. This may impact on the efficiency of the 
            parser since it visits the whole expression tree even if some of its nodes
            are not required by a particular parser but it simplifies the logic of the
            expression node handler and improves the makes the intention of the handler
            more clear:

                parser.on({
                    expression: 'FunctionExpression',
                    do: ({ treeNode: functionExpression }) => {

                        const function = Funtion.new()

                        if( functionExpression.id !== null ) {
                            function.setName(
                                functionExpression.id // already visited and converted to objects
                            )
                        }

                        function.setParams(
                            functionExpression.params // already visited and converted to objects
                        )

                        function.setBody(
                            functionExpression.body // already visited and converted to objects
                        )

                        return function    
                    }
                })

        These differences, even small and subtle, makes easier to write customized parsers
        and to gradually add complexity to their logic.
    `)
*/
class JsParserDsl {

    // Initializing

    static definition() {
        this.instanceVariables = ['expressionConverters']
        this.assumes = [JsFileParser, ObjectWithNamespace]
    }

    afterInstantiation() {
        this.expressionConverters = new Map()
    }

    // Configuring

    on({ expression: expressionTag, do: closure }) {
        this.expressionConverters.set(
            expressionTag,
            closure
        )
    }

    // Parsing

    /*
     * Dynamically call a function named 'visit[treeNode.type]'.
     * In the future generate the source code for each 'visit[...]' function call to make sure
     * that the implemented 'visit[...]'' functions are always in sync with the existing node types from
     *      https://esprima.readthedocs.io/en/latest/syntax-tree-format.html
     */
    visit(treeNode) {
        const treeNodeType = treeNode.type

        const expressionComment = treeNode.comment

        let result = this.previousClassificationDo( () => {
            return this.visit( treeNode )
        })

        return this.applyConverterToTreeNode({
            treeNode: result,
            treeNodeType: treeNodeType,
            locationInFile: { startPos: treeNode.range[0], endPos: treeNode.range[1] },
            expressionComment: expressionComment,
        })
    }

    applyConverterToTreeNode({ treeNode: treeNode, treeNodeType: treeNodeType,
        locationInFile: locationInFile, expressionComment: expressionComment,
    }) {
        let expressionConverter = this.expressionConverters.get( treeNodeType )

        if( expressionConverter === undefined ) {
            expressionConverter = this.expressionConverters.get( 'allNodes' )
        }

        return expressionConverter === undefined ?
            treeNode
            :
            expressionConverter({
                treeNode: treeNode,
                treeNodeType: treeNodeType,
                locationInFile: locationInFile,
                expressionComment: expressionComment,
            })
    }
}

module.exports = Classification.define(JsParserDsl)
