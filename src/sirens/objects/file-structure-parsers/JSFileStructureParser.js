const Classification = require('../../../O').Classification
const FullParseTreeVisitorProtocol_Implementation = require('../../protocols/FullParseTreeVisitorProtocol_Implementation')
const JsFileParser = require('../js-parser/JsFileParser')
const JsFileStructure = require('../file-structure/JsFileStructure')
const JsComment = require('../file-structure/JsComment')
const JsClass = require('../file-structure/JsClass')
const JsMethod = require('../file-structure/JsMethod')
const TextualContent = require('../file-structure/TextualContent')

class JSFileStructureParser {

    static definition() {
        this.instanceVariables = ['fileObjects']
        this.assumes = [JsFileParser]
        this.implements = [FullParseTreeVisitorProtocol_Implementation]
    }

    /// Visiting

    visitTree(treeNode) {
        this.fileObjects = []

        const jsFileStructure = JsFileStructure.new()

        jsFileStructure.setFileLocation({
            sourceFile: this.getSourceFile(),
            startLine: treeNode.loc.start.line,
            startColumn: treeNode.loc.start.column,
            endLine: treeNode.loc.end.line,
            endColumn: treeNode.loc.end.column,
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
            startLine: classDeclaration.loc.start.line,
            startColumn: classDeclaration.loc.start.column,
            endLine: classDeclaration.loc.end.line,
            endColumn: classDeclaration.loc.end.column,
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

        const method = JsMethod.new()

        method.setFileLocation({
            sourceFile: this.getSourceFile(),
            startLine: functionNode.loc.start.line,
            startColumn: functionNode.loc.start.column,
            endLine: functionNode.loc.end.line,
            endColumn: functionNode.loc.end.column,
        }) 

        method.setMethodComment( methodComment )

        method.setMethodName( methodName )

        method.setMethodParams( methodParams )

        this.appendChildTocurrentFileObject({ child: method }) 
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
                startLine: currentFileObject.getFileLocation().getStartPos().getLine(),
                startColumn: currentFileObject.getFileLocation().getStartPos().getColumn(),
                endLine: childFileObject.getFileLocation().getStartPos().getLine(),
                endColumn: childFileObject.getFileLocation().getStartPos().getColumn()
            })

            if( textualContent.hasText() ) {
                this.currentFileObject().addChildObject( textualContent )
            }
        } else {

            const lastFileObject = previousFileObjects[ previousFileObjects.length - 1 ]

            const textualContent = this.newTextualContent({
                startLine: lastFileObject.getFileLocation().getEndPos().getLine(),
                startColumn: lastFileObject.getFileLocation().getEndPos().getColumn(),
                endLine: childFileObject.getFileLocation().getStartPos().getLine(),
                endColumn: childFileObject.getFileLocation().getStartPos().getColumn()
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
                startLine: commentNode.loc.start.line,
                startColumn: commentNode.loc.start.column,
                endLine: commentNode.loc.end.line,
                endColumn: commentNode.loc.end.column,
            }) 

        } else {
            comment.setFileLocation({
                sourceFile: this.getSourceFile(),
                startLine: parseNode.loc.start.line,
                startColumn: parseNode.loc.start.column,
                endLine: parseNode.loc.start.line,
                endColumn: parseNode.loc.start.column,
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
                startLine: currentObject.getFileLocation().getStartPos().getLine(),
                startColumn: currentObject.getFileLocation().getStartPos().getColumn(),
                endLine: currentObject.getFileLocation().getEndPos().getLine(),
                endColumn: currentObject.getFileLocation().getEndPos().getColumn()
            })

            if( textualContent.hasText() ) {
                currentObject.addChildObject( textualContent )
            }
        } else {
            const lastObject = objects[ objects.length - 1 ]

            const textualContent = this.newTextualContent({
                startLine: lastObject.getFileLocation().getEndPos().getLine(),
                startColumn: lastObject.getFileLocation().getEndPos().getColumn(),
                endLine: currentObject.getFileLocation().getEndPos().getLine(),
                endColumn: currentObject.getFileLocation().getEndPos().getColumn()
            })

            if( textualContent.hasText() ) {
                currentObject.addChildObject( textualContent )
            }
        }
    }

    newTextualContent({
        startLine: startLine, startColumn: startColumn, endLine: endLine, endColumn: endColumn
    }) {
        const textualContent = TextualContent.new()

        textualContent.setFileLocation({
            sourceFile: this.getSourceFile(),
            startLine: startLine,
            startColumn: startColumn,
            endLine: endLine,
            endColumn: endColumn,
        }) 

        return textualContent
    }
}

module.exports = Classification.define(JSFileStructureParser)
