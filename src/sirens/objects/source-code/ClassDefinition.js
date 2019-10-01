const Classification = require('../../../o-language/classifications/Classification')
const JsStatement = require('./JsStatement')
const FunctionDefinitionsCollector = require('../parsers/FunctionDefinitionsCollector')
const ClassHeader = require('./ClassHeader')
const Comment = require('./Comment')

/*
 * The definition of a javascript class.
 *
 * It is implemented as a wrapper on a parse tree node.
 */
class ClassDefinition {
    /// Definition

    static definition() {
        this.instanceVariables = ['header', 'comment', 'methods']
        this.assumes = [JsStatement]
    }

    /// Initializing

    initialize({ sourceFile: sourceFile, parseNode: parseNode }) {
        this.previousClassificationDo( () => {
            this.initialize({
                sourceFile: sourceFile,
                parseNodes: [parseNode],
            })
        })

        this.header = this.buildHeader()
        this.comment = this.buildComment()
        this.methods = this.buildMethods()
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

    /// Class parts bulding

    buildComment() {
        const classNode = this.getFirstNode()

        if( classNode.comment === undefined ) {
            return this.buildMissingComment()
        }

        return Comment.new({
            sourceFile: this.getSourceFile(),
            parseNode: classNode.comment,
        })
    }

    buildMissingComment() {
        const parseNode = {
            value: '',
            loc: {
                start: {
                    line: this.getStartingLine(),
                    column: this.getStartingColumn(),
                },
                end: {
                    line: this.getStartingLine(),
                    column: this.getStartingColumn(),
                },
            }
        }

        return Comment.new({
            sourceFile: this.getSourceFile(),
            parseNode: parseNode,
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

        return ClassHeader.new({
            sourceFile: this.getSourceFile(),
            parseNodes: statementsFromPreviousClassDefinition,
        })
    }

    buildMethods() {
        const classNode = this.getFirstNode()

        const collector = FunctionDefinitionsCollector.new()

        return collector.collectFunctionDefinitionsIn({
            treeNode: classNode,
            sourceFile: this.getSourceFile(),
        })
    }
}

module.exports = Classification.define(ClassDefinition)
