const Classification = require('../../../../src/O').Classification
const JsFileStructureParser = require('../../../../src/sirens/objects/js-parser/JsFileStructureParser')
const JsClass = require('./structure-objects/JsClass')
const JsMethod = require('./structure-objects/JsMethod')


/*
    Class(`
        This parsers extends a JsFileStructureParser to parse classes and methods
        definitions.
    `)
*/
class JsClassesAndMethodsParser {

    static definition() {
        this.instanceVariables = []
        this.assumes = [JsFileStructureParser]
    }

    /*
        Method(`
            Define the ParserDsl to parse the file contents and convert them to
            a JsFileStructure object.
        `)
    */
    defineParserDsl({ sourceFile: sourceFile, parserDsl: parserDsl }) {
        parserDsl.on({
            expression: 'ClassDeclaration',
            do: ({ treeNode: treeNode, treeNodeType: treeNodeType,
                locationInFile: locationInFile, expressionComment: expressionComment
            }) => {

                const jsClass = this.createJsObject({
                    jsObjectClassification: JsClass,
                    sourceFile: sourceFile,
                    locationInFile: locationInFile,
                    childObjects: treeNode.body,
                })

                const className = treeNode.id

                jsClass.setClassName( className )

                const classComment = this.createJsCommentFrom({
                    sourceFile: sourceFile,
                    locationInFile: locationInFile,
                    expressionComment: expressionComment,
                })

                jsClass.setClassComment( classComment )

                return jsClass
            }
        })

        parserDsl.on({
            expression: 'MethodDefinition',
            do: ({
                treeNode: treeNode, treeNodeType: treeNodeType,
                locationInFile: locationInFile, expressionComment: expressionComment,
            }) => {
                const methodName = treeNode.key

                const methodParams = treeNode.value.params

                return this.createJsMethodFrom({
                    treeNode: treeNode,
                    methodName: methodName,
                    params: methodParams,
                    sourceFile: sourceFile,
                    locationInFile: locationInFile,
                    expressionComment: expressionComment,
                })
            }
        })

        parserDsl.on({
            expression: 'FunctionDeclaration',
            do: ({
                treeNode: treeNode, treeNodeType: treeNodeType,
                locationInFile: locationInFile, expressionComment: expressionComment,
            }) => {
                const methodName = treeNode.id

                const methodParams = treeNode.params

                return this.createJsMethodFrom({
                    treeNode: treeNode,
                    methodName: methodName,
                    params: methodParams,
                    sourceFile: sourceFile,
                    locationInFile: locationInFile,
                    expressionComment: expressionComment,
                })
            }
        })

        parserDsl.on({
            expression: 'RestElement',
            do: ({ treeNode: paramName, treeNodeType: treeNodeType, locationInFile: locationInFile }) => {
                return '...' + paramName
            }
        })
    }

    /*
        Method(`
            Creates a new JsMethod from the given treeNode.
        `)
    */
    createJsMethodFrom({
        treeNode: treeNode, methodName: methodName, params: params,
        sourceFile: sourceFile, locationInFile: locationInFile, expressionComment: expressionComment,
    }) {
        const jsMethod = this.createJsObject({
            jsObjectClassification: JsMethod,
            sourceFile: sourceFile,
            locationInFile: locationInFile,
            childObjects: treeNode.body,
        })

        jsMethod.setMethodName( methodName )

        jsMethod.setMethodParams( params )

        const methodComment = this.createJsCommentFrom({
            sourceFile: sourceFile,
            locationInFile: locationInFile,
            expressionComment: expressionComment,
        })

        jsMethod.setMethodComment( methodComment )

        return jsMethod
    }
}

module.exports = Classification.define(JsClassesAndMethodsParser)
