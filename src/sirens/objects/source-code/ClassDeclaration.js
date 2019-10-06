const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')
const JsStatementProtocol = require('../../protocols/JsStatementProtocol')
const EmptyJsStatement = require('./EmptyJsStatement')
const FunctionDefinitionsCollector = require('../parsers/FunctionDefinitionsCollector')
const ClassHeader = require('./ClassHeader')

class ClassDeclaration {
    /// Definition

    static definition() {
        this.instanceVariables = ['header', 'comment', 'methods']
        this.assumes = [JsStatement]
        this.implements = [JsStatementProtocol]
    }

    /// Initializing

    initialize({ sourceFile: sourceFile, parseNode: parseNode }) {
        this.previousClassificationDo( () => {
            this.initialize({
                sourceFile: sourceFile,
                parseNodes: [parseNode],
            })
        })

        this.methods = this.buildMethods()
        this.comment = this.buildComment()
        this.header = this.buildHeader()
    }

    /// Accessing

    getParseNode() {
        return this.getFirstNode()
    }

    /*
     * Returns the name of the class.
     */
    getClassName() {
        const classNode = this.getFirstNode()

        return classNode.id.name
    }

    /*
     * Returns the statements above the class declaration.
     * This section tipically includes the global requires, the global constants definintions, etc.
     */
    getHeader() {
        return this.header
    }

    getComment() {
        return this.comment
    }

    /*
     * Returns all the functions defined in the file.
     * The functions may be defined in any scope, not just the top most module scope.
     */
    getMethods() {
        return this.methods
    }

    getFunctionDefinitions() {
        const classNode = this.getFirstNode()

        const collector = FunctionDefinitionsCollector.new()

        return collector.collectFunctionDefinitionsIn({
            treeNode: classNode,
            sourceFile: this.getSourceFile(),
        })
    }

    buildHeader() {
        const classNode = this.getFirstNode()

        const statements = this.getSourceFile().getAllStatementsBefore({
            parseNode: classNode,
        })
            
        let statementsBeforePreviousClass = 0

        for( const eachStatement of statements.slice().reverse() ) {

            if( eachStatement.type === 'ClassDeclaration' ) {
                break
            }

            statementsBeforePreviousClass += 1
        }

        const statementsFromPreviousClassDefinition = statements.slice( -statementsBeforePreviousClass )

        if( statementsFromPreviousClassDefinition.length === 0 ) {
            return this.newEmptyHeader()
        } else {
            return ClassHeader.new({
                sourceFile: this.getSourceFile(),
                parseNodes: statementsFromPreviousClassDefinition,
            })
        }
    }

    buildMethods() {
        const classNode = this.getFirstNode()

        const collector = FunctionDefinitionsCollector.new()

        return collector.collectFunctionDefinitionsIn({
            treeNode: classNode,
            sourceFile: this.getSourceFile(),
        })
    }

    newEmptyHeader() {
        let initialObject = this

        if( this.comment.isPresent() ) {
            initialObject = this.comment
        }

        return EmptyJsStatement.new({
            sourceFile: this.getSourceFile(),
            lineNumber: initialObject.getStartingLine(),
            columnNumber: initialObject.getStartingColumn(),
        })
    }
}

module.exports = Classification.define(ClassDeclaration)
