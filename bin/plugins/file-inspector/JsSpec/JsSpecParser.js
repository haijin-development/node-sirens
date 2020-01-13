const Classification = require('../../../../src/O').Classification
const JsFileStructureParser = require('../../../../src/sirens/objects/js-parser/JsFileStructureParser')
const JsSpecFile = require('./structure-objects/JsSpecFile')
const JsSpecTest = require('./structure-objects/JsSpecTest')
const JsSpecDescribe = require('./structure-objects/JsSpecDescribe')
const JsSpecHook = require('./structure-objects/JsSpecHook')

/*
    Class(`
        A JsSpecParser object assumes that the given sourceFile is a javascript file
        defining tests.

        If it is it converts the parsed source code into a tree of

                JsSpecFile
                    JsSpecDescribe
                        JsSpecTest

        and returns the tree.

        The objects in the returned tree can be browsed and edited in an application.
        
        If the given sourceFile is not a file containing tests the parser will fail
        and it returns null.
    `)
*/
class JsSpecParser {

    static definition() {
        this.instanceVariables = []
        this.assumes = [JsFileStructureParser]
    }

    /*
        Method(`
            Returns the parsed contents of the given sourceFile.

            If the file is not a valid .js file or if there are errors during the
            file parsing returns null, meaning that the given sourceFile is not
            parsable by this parser.
        `)
    */
    parse({ sourceFile: sourceFile }) {
        const parsedExpression = this.previousClassificationDo( () => {
            return this.parse({ sourceFile: sourceFile })
        })

        if( parsedExpression === null ) { return null }

        const childObjects = parsedExpression.getChildObjects()

        const isJsSpecObject = childObjects.some( (fileObject) => {
            return fileObject.respondsTo( 'isJsSpecObject' )
        })

        if( ! isJsSpecObject ) { return null }

        parsedExpression.behaveAs( JsSpecFile )

        return parsedExpression
    }

    /*
        Method(`
            Define the ParserDsl to parse the file contents and convert them to
            a JsFileStructure object.
        `)
    */
    defineParserDsl({ sourceFile: sourceFile, parserDsl: parserDsl }) {
        parserDsl.on({
            expression: 'CallExpression',
            do: ({ treeNode: treeNode, treeNodeType: treeNodeType, locationInFile: locationInFile }) => {

                if( treeNode.callee === 'it' ) {
                    const jsSpecTest = this.createJsObject({
                        jsObjectClassification: JsSpecTest,
                        sourceFile: sourceFile,
                        locationInFile: locationInFile,
                    })

                    const testDescription = treeNode.arguments[0]

                    jsSpecTest.setTestDescription( testDescription )

                    return jsSpecTest
                }

                if( treeNode.callee === 'describe' ) {
                    const childTests = treeNode.arguments[1].body

                    const jsSpecDescribe = this.createJsObject({
                        jsObjectClassification: JsSpecDescribe,
                        sourceFile: sourceFile,
                        locationInFile: locationInFile,
                        childObjects: childTests,
                    })

                    const describeText = treeNode.arguments[0]

                    jsSpecDescribe.setDescribeText( describeText )

                    return jsSpecDescribe
                }

                if( [ 'before', 'after', 'beforeEach', 'afterEach' ].includes( treeNode.callee ) ) {
                    const childTests = treeNode.arguments[0].body

                    const jsSpecHook = this.createJsObject({
                        jsObjectClassification: JsSpecHook,
                        sourceFile: sourceFile,
                        locationInFile: locationInFile,
                        childObjects: childTests,
                    })

                    jsSpecHook.setHookType( treeNode.callee )

                    return jsSpecHook
                }

                return treeNode
            }
        })
    }
}

module.exports = Classification.define(JsSpecParser)
