const Classification = require('../../../../src/O').Classification
const ObjectWithNamespace = require('../../../../src/O').ObjectWithNamespace
const OInstance = require('../../../../src/O').OInstance
const JsParserDsl = require('../../../../src/sirens/objects/js-parser/JsParserDsl')
const JsFileStructure = require('./structure-objects/JsFileStructure')
const JsComment = require('./structure-objects/JsComment')
const JsClass = require('./structure-objects/JsClass')
const JsMethod = require('./structure-objects/JsMethod')


class JSFileStructureParser {

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectWithNamespace]
    }

    /// Visiting

    parse({ sourceFile: sourceFile }) {
        const parser = this.getParserDsl({ sourceFile: sourceFile })

        return parser.parse({ sourceFile: sourceFile })
    }

    /*
        Method(`
            Define the ParserDsl to parse the file contents and convert them to
            a JsFileStructure object.
        `)
    */
    getParserDsl({ sourceFile: sourceFile }) {
        const namespace = this.namespace()

        const parser = namespace.JsParserDsl.new()

        parser.on({
            expression: 'Program',
            do: ({ treeNode: childExpressions, treeNodeType: treeNodeType, locationInFile: locationInFile }) => {
                const jsFileStructure = JsFileStructure.new()

                jsFileStructure.setFileLocation({
                    sourceFile: sourceFile,
                    startPos: locationInFile.startPos,
                    endPos: locationInFile.endPos - 1,
                }) 

                const jsObjects = childExpressions.filter( (expression) => {
                    return OInstance.isOInstance( expression )
                })

                if( jsObjects.length > 0 ) {

                    this.addChildrenTo({
                        parentObject: jsFileStructure,
                        childrenObjects: jsObjects,
                        sourceFile: sourceFile,
                    })
                } else {
                    this.appendEndingText({
                        jsObject: jsFileStructure,
                        sourceFile: sourceFile,
                    })
                }

                return jsFileStructure
            }
        })

        parser.on({
            expression: 'ClassDeclaration',
            do: ({ treeNode: treeNode, treeNodeType: treeNodeType,
                locationInFile: locationInFile, expressionComment: expressionComment
            }) => {
                const className = treeNode.id

                const jsClass = JsClass.new()

                jsClass.setFileLocation({
                    sourceFile: sourceFile,
                    startPos: locationInFile.startPos,
                    endPos: locationInFile.endPos - 1,
                })

                jsClass.setClassName( className )

                const classComment = this.createJsCommentFrom({
                    sourceFile: sourceFile,
                    locationInFile: locationInFile,
                    expressionComment: expressionComment,
                })

                jsClass.setClassComment( classComment )

                const jsObjects = treeNode.body.filter( (expression) => {
                    return OInstance.isOInstance( expression )
                })

                this.addChildrenTo({
                    parentObject: jsClass,
                    childrenObjects: jsObjects,
                    sourceFile: sourceFile,
                })

                return jsClass
            }
        })

        parser.on({
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

        parser.on({
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

        parser.on({
            expression: 'RestElement',
            do: ({ treeNode: paramName, treeNodeType: treeNodeType, locationInFile: locationInFile }) => {
                return '...' + paramName
            }
        })


        return parser
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
        const jsMethod = JsMethod.new()

        jsMethod.setNamespace( this.namespace() )

        jsMethod.setFileLocation({
            sourceFile: sourceFile,
            startPos: locationInFile.startPos,
            endPos: locationInFile.endPos - 1,
        }) 

        jsMethod.setMethodName( methodName )

        jsMethod.setMethodParams( params )

        const methodComment = this.createJsCommentFrom({
            sourceFile: sourceFile,
            locationInFile: locationInFile,
            expressionComment: expressionComment,
        })

        jsMethod.setMethodComment( methodComment )

        if( treeNode.body !== undefined ) {
            const jsObjects = treeNode.body.filter( (expression) => {
                return OInstance.isOInstance( expression )
            })

            this.addChildrenTo({
                parentObject: jsMethod,
                childrenObjects: jsObjects,
                sourceFile: sourceFile,
            })
        }

        return jsMethod
    }

    /*
        Gets the comment expression bound to the given treeNode and return a new
        JsComment object from it.

        If the given treeNode does not have a comment create a JsComment of length 0
        at the position of the begining of the given treeNode. That empty JsComment
        may be edited later by the application.
    */
    createJsCommentFrom({
        sourceFile: sourceFile, locationInFile: locationInFile, expressionComment: expressionComment
    }) {
        const comment = JsComment.new()

        if( expressionComment !== undefined ) {
            comment.setFileLocation({
                sourceFile: sourceFile,
                startPos: expressionComment.range[0],
                endPos: expressionComment.range[1] - 1,
            })

        } else {
            comment.setFileLocation({
                sourceFile: sourceFile,
                startPos: locationInFile.startPos,
                endPos: locationInFile.startPos - 1,
            }) 
        }

        return comment
    }

    /*
        Method(`
            This parser collects classes and methods.

            After the last child method or class there might be additional valid
            statements like function calls or variable definitions.

            This method gets the statements after the last child of the given
            JsFileObject and adds a TextualContent object as its last child.
        `)
    */
    appendEndingText({ jsObject: jsObject, sourceFile: sourceFile }) {
        const textualContent = this.createEndingText({
            jsObject: jsObject,
            sourceFile: sourceFile,
        })

        if( textualContent.hasText() ) {
            jsObject.addChildObject( textualContent )
        }
    }

    /*
        Method(`
            Add the given jsObjects to the given parentObject.

            If between two consecutives children there are more statements
            other that classes and methods definitions add those statements
            as TextualContent as well.
        `)
    */
    addChildrenTo({ parentObject: parentObject, childrenObjects: jsObjects, sourceFile: sourceFile }) {
        let i = 0
        let last = jsObjects.length - 1

        for( const childObject of jsObjects ) {
            if( i === 0 ) {
                const textualContent = this.createTextualContent({
                    startPos: parentObject.getFileLocation().getStartPos(),
                    endPos: childObject.getFileLocation().getStartPos() - 1,
                    sourceFile: sourceFile, 
                })

                if( textualContent.hasText() ) {
                    parentObject.addChildObject( textualContent )
                }
            }

            if( i > 0 ) {
                const previousChild = jsObjects[ i - 1 ]

                const textualContent = this.createTextualContent({
                    startPos: previousChild.getFileLocation().getEndPos() + 1,
                    endPos: childObject.getFileLocation().getStartPos() - 1,
                    sourceFile: sourceFile, 
                })

                if( textualContent.hasText() ) {
                    parentObject.addChildObject( textualContent )
                }
            }

            parentObject.addChildObject( childObject )

            i += 1
        }

        const lastChild = jsObjects[ jsObjects.length - 1 ]

        if( lastChild !== undefined )
        {
            const textualContent = this.createTextualContent({
                startPos: lastChild.getFileLocation().getEndPos() + 1,
                endPos: parentObject.getFileLocation().getEndPos() - 1,
                sourceFile: sourceFile, 
            })

            if( textualContent.hasText() ) {
                parentObject.addChildObject( textualContent )
            }                
        }
    }

    /*
        Method(`
            This parser collects classes and methods.

            After the last child (a method or a class) there might be additional valid
            statements like function calls or variable definitions.

            This method gets the statements after the last child of the given
            JsFileObject and returns a TextualContent object on them.
        `)
    */
    createEndingText({ jsObject: jsObject, sourceFile: sourceFile }) {
        const objects = jsObject.getChildObjects()

        if( objects.length === 0 ) {

            return this.createTextualContent({
                startPos: jsObject.getFileLocation().getStartPos(),
                endPos: jsObject.getFileLocation().getEndPos(),
                sourceFile: sourceFile,
            })

        } else {

            const lastObject = objects[ objects.length - 1 ]

            return this.createTextualContent({
                startPos: lastObject.getFileLocation().getEndPos() + 1,
                endPos: jsObject.getFileLocation().getEndPos() - 1,
                sourceFile: sourceFile,
            })

        }
    }

    /*
        Method(`
            Creates a new TextualContent object on the given file position.
        `)
    */
    createTextualContent({ startPos: startPos, endPos: endPos, sourceFile: sourceFile }) {
        const textualContent = this.namespace().TextualContent.new()

        textualContent.setFileLocation({
            sourceFile: sourceFile,
            startPos: startPos,
            endPos: endPos,
        }) 

        return textualContent
    }
}

module.exports = Classification.define(JSFileStructureParser)
