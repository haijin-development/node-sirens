const Classification = require('../../../../src/O').Classification
const ObjectWithNamespace = require('../../../../src/O').ObjectWithNamespace
const FullParseTreeVisitorProtocol_Implementation = require('../../../../src/sirens/protocols/FullParseTreeVisitorProtocol_Implementation')
const JsFileParser = require('../../../../src/sirens/objects/js-parser/JsFileParser')
const JsFileStructure = require('./structure-objects/JsFileStructure')
const JsComment = require('./structure-objects/JsComment')
const JsClass = require('./structure-objects/JsClass')
const JsMethod = require('./structure-objects/JsMethod')

class JSFileStructureParser {

    static definition() {
        this.instanceVariables = ['fileObjects']
        this.assumes = [JsFileParser, ObjectWithNamespace]
        this.implements = [FullParseTreeVisitorProtocol_Implementation]
    }

    /// Visiting

    visitTree(treeNode) {
        this.fileObjects = []

        const jsFileStructure = JsFileStructure.new()

        jsFileStructure.setFileLocation({
            sourceFile: this.getSourceFile(),
            startPos: treeNode.range[0],
            endPos: treeNode.range[1] - 1,
        }) 

        this.fileObjects.push( jsFileStructure )

        this.visit(treeNode)

        this.appendEndingText()

        return jsFileStructure
    }

    visitClassDeclaration(classDeclaration) {
        const className = classDeclaration.id.name

        const classComment = this.getCommentOn({ parseNode: classDeclaration })

        const jsClass = JsClass.new()

        jsClass.setFileLocation({
            sourceFile: this.getSourceFile(),
            startPos: classDeclaration.range[0],
            endPos: classDeclaration.range[1] - 1,
        })

        jsClass.setClassName( className )

        jsClass.setClassComment( classComment )

        this.appendChildTocurrentFileObject({ child: jsClass })

        this.duringFileObject({
            fileObject: jsClass,
            do: () => {
                this.visit( classDeclaration.body )
            },
        })
    }

    visitMethodDefinition(methodDefinition) {
        this.createMethodOrFunction(methodDefinition)
    }

    visitFunctionDeclaration(functionDeclaration) {
        this.createMethodOrFunction(functionDeclaration)
    }

    createMethodOrFunction(functionNode) {
        const methodName = functionNode.id ?
            this.visit( functionNode.id ) : this.visit( functionNode.key )

        let methodParams = []

        if( functionNode.params !== undefined ) {
            methodParams  = functionNode.params.map( (param) => {
                return this.visit( param )
            })
        }

        if( functionNode.value !== undefined ) {
            methodParams = this.visit( functionNode.value ).params
        }

        const methodComment = this.getCommentOn({ parseNode: functionNode })

        const jsMethod = JsMethod.new()
        jsMethod.setNamespace( this.namespace() )
        jsMethod.lockNamespace()

        jsMethod.setFileLocation({
            sourceFile: this.getSourceFile(),
            startPos: functionNode.range[0],
            endPos: functionNode.range[1] - 1,
        }) 

        jsMethod.setMethodComment( methodComment )

        jsMethod.setMethodName( methodName )

        jsMethod.setMethodParams( methodParams )

        this.appendChildTocurrentFileObject({ child: jsMethod }) 
    }

    visitRestElement(restElement) {
        const paramName = this.visit( restElement.argument )

        return '...' + paramName
    }

    /// Helper methods

    appendChildTocurrentFileObject({ child: childFileObject }) {
        const currentFileObject = this.currentFileObject()

        const previousFileObjects = currentFileObject.getChildObjects()

        if( previousFileObjects.length === 0 ) {
            const textualContent = this.newTextualContent({
                startPos: 0,
                endPos: childFileObject.getFileLocation().getStartPos() - 1,
            })

            if( textualContent.hasText() ) {
                this.currentFileObject().addChildObject( textualContent )
            }
        } else {

            const lastFileObject = previousFileObjects[ previousFileObjects.length - 1 ]

            const textualContent = this.newTextualContent({
                startPos: lastFileObject.getFileLocation().getEndPos() + 1,
                endPos: childFileObject.getFileLocation().getStartPos() - 1,
            })

            if( textualContent.hasText() ) {
                currentFileObject.addChildObject( textualContent )
            }
        }

        this.currentFileObject().addChildObject( childFileObject )
    }

    getCommentOn({ parseNode: parseNode }) {
        const comment = JsComment.new()

        if( parseNode.comment !== undefined ) {
            let commentNode = parseNode.comment

            comment.setFileLocation({
                sourceFile: this.getSourceFile(),
                startPos: commentNode.range[0],
                endPos: commentNode.range[1] - 1,
            })

        } else {
            comment.setFileLocation({
                sourceFile: this.getSourceFile(),
                startPos: parseNode.range[0],
                endPos: parseNode.range[0] - 1,
            }) 
        }

        return comment
    }

    duringFileObject({ fileObject: fileObject, do: closure }) {
        try {
            this.fileObjects.push( fileObject )

            closure()

            this.appendEndingText()

        } finally {
            this.fileObjects.pop()
        }
    }

    currentFileObject() {
        return this.fileObjects[ this.fileObjects.length - 1 ]
    }

    appendEndingText() {
        const currentObject = this.currentFileObject()

        const objects = currentObject.getChildObjects()

        if( objects.length === 0 ) {
            const textualContent = this.newTextualContent({
                startPos: currentObject.getFileLocation().getStartPos(),
                endPos: currentObject.getFileLocation().getEndPos(),
            })

            if( textualContent.hasText() ) {
                currentObject.addChildObject( textualContent )
            }
        } else {
            const lastObject = objects[ objects.length - 1 ]

            const textualContent = this.newTextualContent({
                startPos: lastObject.getFileLocation().getEndPos() + 1,
                endPos: currentObject.getFileLocation().getEndPos() - 1,
            })

            if( textualContent.hasText() ) {
                currentObject.addChildObject( textualContent )
            }
        }
    }

    newTextualContent({ startPos: startPos, endPos: endPos }) {
        const textualContent = this.namespace().TextualContent.new()

        textualContent.setFileLocation({
            sourceFile: this.getSourceFile(),
            startPos: startPos,
            endPos: endPos,
        }) 

        return textualContent
    }
}

module.exports = Classification.define(JSFileStructureParser)
