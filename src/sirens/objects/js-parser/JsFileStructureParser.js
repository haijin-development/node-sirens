const Classification = require('../../../../src/O').Classification
const ObjectWithNamespace = require('../../../../src/O').ObjectWithNamespace
const OInstance = require('../../../../src/O').OInstance
const JsFileStructure = require('./structure-objects/JsFileStructure')
const JsComment = require('./structure-objects/JsComment')

/*
    Class(`
        Base classification for classifications that parses js files.

        Defines the basic protocol to handle code comments and text and leaves
        the definition of the javascript expressions of interest to other classification.
    `)
*/
class JsFileStructureParser {

    static definition() {
        this.instanceVariables = []
        this.assumes = [ObjectWithNamespace]
    }

    /*
        Method(`
            Returns true if the sourceFile is a .js file.

            This is quick check before starting the actual parsing of the file to know
            if it is a valid .js file since starting the parsing of a file can be
            an expensive operation.
        `)
    */
    handlesFileTypeOf({ sourceFile: sourceFile }) {
        const fileExtension = sourceFile.getFileNameExtension()

        return '.js' === fileExtension
    }

    /// Visiting

    /*
        Method(`
            Returns the parsed contents of the given sourceFile.

            If the file is not a valid .js file or if there are errors during the
            file parsing returns null, meaning that the given sourceFile is not
            parsable by this parser.
        `)
    */
    parse({ sourceFile: sourceFile }) {
        if( ! this.handlesFileTypeOf({ sourceFile: sourceFile }) ) { return null }

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

        const parserDsl = namespace.JsParserDsl.new()

        parserDsl.on({
            expression: 'Program',
            do: ({ treeNode: childExpressions, treeNodeType: treeNodeType, locationInFile: locationInFile }) => {
                const jsFileStructure = this.createJsObject({
                    jsObjectClassification: JsFileStructure,
                    sourceFile: sourceFile,
                    locationInFile: locationInFile,
                })

                const jsObjects = this.selectJsObjectsOnlyFrom({
                    expressions: childExpressions
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

        this.defineParserDsl({
            sourceFile: sourceFile,
            parserDsl: parserDsl,
        })

        return parserDsl
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
        const textualContent = this.isCommentOnly({ startPos: startPos, endPos: endPos, sourceFile: sourceFile }) ?
            JsComment.new()
            :
            this.namespace().TextualContent.new()

        textualContent.setFileLocation({
            sourceFile: sourceFile,
            startPos: startPos,
            endPos: endPos,
        })

        return textualContent
    }

    /*
        Method(`
            Returns true if the text between the given startPos and endPos of the
            given sourceFile contains only code comments.
        `)
    */
    isCommentOnly({ startPos: startPos, endPos: endPos, sourceFile: sourceFile }) {
        const contents = sourceFile.getPartialContents({
            fromStartPos: startPos,
            toEndPos: endPos
        })

        const namespace = this.namespace()

        const parser = namespace.JsParserDsl.new()

        try {
            const parsedContents = parser.parseString({ string: contents })

            return parsedContents.length === 0

        } catch( error ) {
            return false
        }
    }

    /*
        Method(`
            Given the collection of expressions filters and returns only the
            ones that are JsObject expressions
        `)
    */
    selectJsObjectsOnlyFrom({ expressions: expressions }) {
        return expressions.filter( (expression) => {
            return OInstance.isOInstance( expression )
        })
    }

    /*
        Method(`
            Creates and returns a new object from the given jsObjectClassification.

            The created object is set with this.namespace and the proper sourceFile
            and position in the file.

            If the optional parameter childObjects is given it also filters the
            childObject from the parameter and adds it to the created JsObject.
        `)
    */
    createJsObject({
        jsObjectClassification: jsObjectClassification,
        sourceFile: sourceFile, locationInFile: locationInFile,
        childObjects: childObjects,
    }) {
        const jsObject = jsObjectClassification.new()

        jsObject.setNamespace( this.namespace() )

        jsObject.setFileLocation({
            sourceFile: sourceFile,
            startPos: locationInFile.startPos,
            endPos: locationInFile.endPos - 1,
        })

        if( childObjects !== undefined ) {
            const jsObjects = this.selectJsObjectsOnlyFrom({
                expressions: childObjects
            })

            this.addChildrenTo({
                parentObject: jsObject,
                childrenObjects: jsObjects,
                sourceFile: sourceFile,
            })
        }

        return jsObject
    }
}

module.exports = Classification.define(JsFileStructureParser)
