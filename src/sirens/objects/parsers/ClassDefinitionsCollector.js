const Classification = require('../../../O').Classification
const ParseTreeVisitor = require('./ParseTreeVisitor')
const ClassDefinition = require('../source-code/ClassDefinition')
const ClassDeclaration = require('../source-code/ClassDeclaration')
const ClassHeader = require('../source-code/ClassHeader')
const EmptyJsStatement = require('../source-code/EmptyJsStatement')
const AbsentComment = require('../source-code/AbsentComment')
const FullParseTreeVisitorProtocol_Implementation = require('../../protocols/FullParseTreeVisitorProtocol_Implementation')

/*
 * A visitor of a javascript parse tree that collects all the function definitions.
 */
class ClassDefinitionsCollector {

    static definition() {
        this.instanceVariables = ['sourceFile', 'collectedClassDefinitions']
        this.assumes = [ParseTreeVisitor]
        this.implements = [FullParseTreeVisitorProtocol_Implementation]
    }

    collectClassDefinitionsIn({ treeNode: treeNode, sourceFile: sourceFile }) {
        if( treeNode === null ) {
            return []
        }

        this.sourceFile = sourceFile
        this.collectedClassDefinitions = [] 

        this.visit(treeNode)

        return this.collectedClassDefinitions
    }

    /// Visiting

    visitClassDeclaration(classDeclaration) {
        const classDefinition = this.newClassDefinition({
            parseNode: classDeclaration
        })

        this.collectedClassDefinitions.push( classDefinition )
    }

    visitClassExpression(classExpression) {
        const classDefinition = this.newClassDefinition({
            parseNode: classExpression
        })

        this.collectedClassDefinitions.push( classDefinition )
    }

    newClassDefinition({ parseNode: parseNode }) {
        const classDeclaration = ClassDeclaration.new({
            sourceFile: this.sourceFile,
            parseNode: parseNode,
        })

        const comment = this.getCommentOn({
            parseNode: parseNode,
            classDeclaration: classDeclaration,
        })

        const header = this.getHeader({ parseNode: parseNode })

        return ClassDefinition.new({
            header: header,
            comment: comment,
            declaration: classDeclaration,
        })
    }

    getCommentOn({ parseNode: parseNode, classDeclaration: classDeclaration }) {
        const Comment = require('../source-code/Comment')

        if( parseNode.comment === undefined ) {
            return this.buildMissingComment({
                parseNode: parseNode,
                classDeclaration: classDeclaration,
            })
        }

        return Comment.new({
            sourceFile: this.sourceFile,
            parseNode: parseNode.comment,
        })
    }

    buildMissingComment({ parseNode: parseNode, classDeclaration: classDeclaration }) {
        const { indentationChar, indentationCount } = classDeclaration.detectIdentation()

        return AbsentComment.new({
            sourceFile: this.sourceFile,
            lineNumber: parseNode.loc.start.line,
            columnNumber: parseNode.loc.start.column,
            indentationCount: indentationCount,
            indentationChar: indentationChar,
        })
    }

    getHeader({ parseNode: parseNode }) {
        const statements = this.sourceFile.getAllStatementsBefore({
            parseNode: parseNode,
        })

        const statementsBeforeClassDefinition = []

        for( const eachStatement of statements.slice().reverse() ) {

            if( eachStatement.type === 'ClassDeclaration' ) {
                break
            }

            statementsBeforeClassDefinition.unshift( eachStatement )
        }

        if( statementsBeforeClassDefinition.length === 0 ) {
            return this.newEmptyHeader({
                parseNode: parseNode,
            })
        } else {
            return ClassHeader.new({
                sourceFile: this.sourceFile,
                parseNodes: statementsBeforeClassDefinition,
            })
        }
    }

    newEmptyHeader({ parseNode: parseNode }) {
        return EmptyJsStatement.new({
            sourceFile: this.sourceFile,
            lineNumber: parseNode.loc.start.line,
            columnNumber: parseNode.loc.start.column,
        })
    }}

module.exports = Classification.define(ClassDefinitionsCollector)
