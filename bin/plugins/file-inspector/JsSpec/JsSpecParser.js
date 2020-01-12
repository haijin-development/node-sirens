const Classification = require('../../../../src/O').Classification
const JsFileStructureParser = require('../../../../src/sirens/objects/js-parser/JsFileStructureParser')
const JsSpecTest = require('./structure-objects/JsSpecTest')
const JsSpecDescribe = require('./structure-objects/JsSpecDescribe')

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

        const hasATest = childObjects.some( (fileObject) => {
            return fileObject.respondsTo( 'isJsSpecObject' )
        })

        if( ! hasATest ) { return null }

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

                return treeNode
            }
        })
    }
}

module.exports = Classification.define(JsSpecParser)
