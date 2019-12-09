const Classification = require('../../../O').Classification
const JsFileParser = require('./JsFileParser')
const FullParseTreeVisitorProtocol_Implementation = require('../../protocols/FullParseTreeVisitorProtocol_Implementation')
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

        jsFileStructure.setSourceFile( this.getSourceFile() )

        jsFileStructure.setStartPos({
            line: treeNode.loc.start.line,
            column: treeNode.loc.start.column,
        })
        
        jsFileStructure.setEndPos({
            line: treeNode.loc.end.line,
            column: treeNode.loc.end.column,
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

        jsClass.setSourceFile( this.getSourceFile() )

        jsClass.setStartPos({
            line: classDeclaration.loc.start.line,
            column: classDeclaration.loc.start.column,
        })
        
        jsClass.setEndPos({
            line: classDeclaration.loc.end.line,
            column: classDeclaration.loc.end.column,
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

        method.setSourceFile( this.getSourceFile() )

        method.setStartPos({
            line: functionNode.loc.start.line,
            column: functionNode.loc.start.column,
        })
        
        method.setEndPos({
            line: functionNode.loc.end.line,
            column: functionNode.loc.end.column,
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
                startLine: currentFileObject.getStartPos().getLine(),
                startColumn: currentFileObject.getStartPos().getColumn(),
                endLine: childFileObject.getStartPos().getLine(),
                endColumn: childFileObject.getStartPos().getColumn()
            })

            if( textualContent.hasText() ) {
                this.currentFileObject().addChildObject( textualContent )
            }
        } else {

            const lastFileObject = previousFileObjects[ previousFileObjects.length - 1 ]

            const textualContent = this.newTextualContent({
                startLine: lastFileObject.getEndPos().getLine(),
                startColumn: lastFileObject.getEndPos().getColumn(),
                endLine: childFileObject.getStartPos().getLine(),
                endColumn: childFileObject.getStartPos().getColumn()
            })

            if( textualContent.hasText() ) {
                currentFileObject.addChildObject( textualContent )
            }
        }

        this.currentFileObject().addChildObject( childFileObject )
    }

    getCommentOn({ parseNode: parseNode }) {
        const comment = JsComment.new()

        comment.setSourceFile( this.getSourceFile() )

        if( parseNode.comment !== undefined ) {
            let commentNode = parseNode.comment

            comment.setStartPos({
                line: commentNode.loc.start.line,
                column: commentNode.loc.start.column,
            })
            
            comment.setEndPos({
                line: commentNode.loc.end.line,
                column: commentNode.loc.end.column,
            })
        } else {
            comment.setStartPos({
                line: parseNode.loc.start.line,
                column: parseNode.loc.start.column,
            })
            
            comment.setEndPos({
                line: parseNode.loc.start.line,
                column: parseNode.loc.start.column,
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
                startLine: currentObject.getStartPos().getLine(),
                startColumn: currentObject.getStartPos().getColumn(),
                endLine: currentObject.getEndPos().getLine(),
                endColumn: currentObject.getEndPos().getColumn()
            })

            if( textualContent.hasText() ) {
                currentObject.addChildObject( textualContent )
            }
        } else {
            const lastObject = objects[ objects.length - 1 ]

            const textualContent = this.newTextualContent({
                startLine: lastObject.getEndPos().getLine(),
                startColumn: lastObject.getEndPos().getColumn(),
                endLine: currentObject.getEndPos().getLine(),
                endColumn: currentObject.getEndPos().getColumn()
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

        textualContent.setSourceFile( this.getSourceFile() )

        textualContent.setStartPos({
            line: startLine,
            column: startColumn,
        })

        textualContent.setEndPos({
            line: endLine,
            column: endColumn,
        })

        return textualContent
    }
}

module.exports = Classification.define(JSFileStructureParser)
