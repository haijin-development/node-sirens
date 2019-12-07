const Classification = require('../../../O').Classification
const JsFileParser = require('./JsFileParser')
const FullParseTreeVisitorProtocol_Implementation = require('../../protocols/FullParseTreeVisitorProtocol_Implementation')
const JsFile = require('../file-structure/JsFile')
const JsComment = require('../file-structure/JsComment')
const JsClass = require('../file-structure/JsClass')
const JsMethod = require('../file-structure/JsMethod')

class JSFileStructureParser {

    static definition() {
        this.instanceVariables = ['sections', 'textStatementsCount']
        this.assumes = [JsFileParser]
        this.implements = [FullParseTreeVisitorProtocol_Implementation]
    }

    /// Visiting

    visitTree(treeNode) {
        this.sections = []
        this.textStatementsCount = []

        const jsFile = JsFile.new()

        jsFile.setSourceFile( this.getSourceFile() )

        jsFile.setStartPos({
            line: 0,
            column: 0,
        })
        
        jsFile.setEndPos({
            line: treeNode.loc.end.line,
            column: treeNode.loc.end.column,
        })

        this.sections.push( jsFile )

        this.visit(treeNode)

        return jsFile
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

        this.appendChildToCurrentSection({ child: jsClass })

        this.duringSection({ section: jsClass, do: () => {
            this.visit( classDeclaration.body )
        }})
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

        this.appendChildToCurrentSection({ child: method }) 
    }

    visitRestElement(restElement) {
        const paramName = this.visit( restElement.argument )

        return '...' + paramName
    }

    /// Helper methods

    appendChildToCurrentSection({ child: childSection }) {
        const previousSections = this.currentSection().getChildSections()

        if( previousSections.length > 0 ) {
            const lastSection = previousSections[ previousSections.length - 1 ]
            const textualContentBetweenSections = lastSection.textualContentBetween( childSection )
            if( textualContentBetweenSections.hasText() ) {
                this.currentSection().addChildSection( textualContentBetweenSections )
            }
        }

        this.currentSection().addChildSection( childSection )
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

    duringSection({ section: section, do: closure }) {
        try {
            this.sections.push( section )
            this.textStatementsCount.push( 0 )

            closure()
        } finally {
            this.sections.pop()
        }
    }

    currentSection() {
        return this.sections[ this.sections.length - 1 ]
    }

    textStatementsCount() {
        return this.textStatementsCount[ this.textStatementsCount.length - 1 ]
    }

    incrementTextStatementsCount() {
        return this.textStatementsCount[ this.textStatementsCount.length - 1 ] += 1
    }
}

module.exports = Classification.define(JSFileStructureParser)
